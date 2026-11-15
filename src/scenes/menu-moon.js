import * as THREE from '../vendor/three/three.module.js';
import { GLTFLoader } from '../vendor/three/GLTFLoader.js';
import lighting from '../../public/assets/models/moon-lighting.json';
import { assetUrl } from '../core/assets';

// A classic data script makes the identical binary available on opaque file:// origins.
// No file fetch, CDN, module script, decoder, or server is required by the release.
let binaryPromise;
async function moonBinary() {
  if (import.meta.env.DEV) return (await fetch(assetUrl('assets/models/moon-menu.glb'))).arrayBuffer();
  if (!binaryPromise) binaryPromise = new Promise((resolve, reject) => {
    const decode = () => {
      try {
        const encoded = window.__SPACE_PAPERS_MOON__;
        if (!encoded) throw new Error('Missing Moon binary');
        const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
        resolve(bytes.buffer);
      } catch (error) { reject(error); }
    };
    if (window.__SPACE_PAPERS_MOON__) return decode();
    const script = document.createElement('script');
    script.src = new URL(window.__SPACE_PAPERS_MOON_SCRIPT__, document.baseURI).href;
    script.onload = decode;
    script.onerror = () => { binaryPromise = undefined; script.remove(); reject(new Error('Moon data unavailable')); };
    document.head.append(script);
  });
  return binaryPromise;
}

/** All GPU resources and event listeners belong to a single menu visit. */
export function mountMenuMoon(root, initialReduced) {
  const host = root.querySelector('#moon-scene');
  const zone = root.querySelector('[data-menu-control="orbit"]');
  const abort = new AbortController(), options = { signal: abort.signal };
  let disposed = false, reduced = initialReduced, paused = false, dragging = false;
  let renderer, scene, camera, model, pivot, spin, mixer, stars, frame = 0, last = 0;
  let lightTime = initialReduced ? 47 / lighting.fps : 0, intro = 0, zoom = 1, zoomTarget = 1, leaving = false;
  let inputX = 0, inputY = 0, lastX = 0, lastY = 0, velocityX = 0, velocityY = 0;
  let lastInteraction = -100, pinchDistance = 0, pointers = new Map();
  const lights = [], assets = new Set();
  const initialRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(.08, Math.PI + .35, -.12));
  const targetRotation = initialRotation.clone();
  const campusNormal = new THREE.Vector3(.07,.70,-.71).normalize();
  const campusQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), campusNormal);
  const campusMatrix = new THREE.Matrix4().compose(campusNormal.clone().multiplyScalar(1.055), campusQuaternion, new THREE.Vector3(.40,.40,.40)).multiply(new THREE.Matrix4().makeTranslation(0,-1,0));
  const rotationDelta = new THREE.Quaternion();
  const axisY = new THREE.Vector3(0, 1, 0), axisX = new THREE.Vector3(1, 0, 0);
  const state = () => {
    // Small DOM diagnostics also allow testing the actual production renderer.
    root.dataset.orbit = spin ? spin.quaternion.toArray().map(n => n.toFixed(4)).join(',') : '';
    root.dataset.lightFrame = String(Math.min(48, Math.floor(lightTime * lighting.fps) + 1));
    root.dataset.rotationPaused = String(paused);
  };
  const fallback = error => {
    if (error?.message) root.dataset.sceneError = error.message;
    if (disposed) return;
    root.dataset.sceneState = 'fallback'; root.classList.add('scene-fallback');
    root.querySelector('#moon-status').textContent = 'LUNAR OBSERVATORY · STILL VIEW';
    if (frame) cancelAnimationFrame(frame);
  };
  function resize() {
    if (disposed || !renderer) return;
    const width = root.clientWidth, height = root.clientHeight;
    const portrait = width < 1000 && width < height;
    const radiusPixels = portrait ? Math.min(width * .31, 167) : Math.min(height * .345, width * .24);
    const distance = height / (2 * radiusPixels * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    camera.position.set(0, 0, distance);
    camera.aspect = width / height;
    camera.setViewOffset(width, height, portrait ? 0 : -width * .205, portrait ? height * .5 - 227 : height * .01, width, height);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, width < 1000 ? 1.5 : 1.75));
    renderer.setSize(width, height, false);
    renderStill();
  }
  function sampleLights(time) {
    const cursor = Math.min(lighting.endFrame - 1, time * lighting.fps);
    const a = Math.floor(cursor), b = Math.min(a + 1, lighting.endFrame - 1), mix = cursor - a;
    for (let i = 0; i < lights.length; i++) {
      const spec = lighting.lights[i], from = spec.samples[a], to = spec.samples[b], light = lights[i];
      const radius = lighting.moon.approximateRadius;
      light.position.set(...from.position).divideScalar(radius);
      if(spec.parent) light.position.applyMatrix4(campusMatrix);
      light.color.setRGB(...from.color, THREE.LinearSRGBColorSpace);
      const endColor = new THREE.Color().setRGB(...to.color, THREE.LinearSRGBColorSpace);
      light.color.lerp(endColor, mix);
      light.intensity = (from.intensity + (to.intensity - from.intensity) * mix) / (radius * radius) * (spec.parent ? .40*.40 : 1);
    }
  }
  function renderStill() {
    if (disposed || !renderer || !model) return;
    renderer.render(scene, camera); state();
  }
  function schedule() {
    if (!disposed && !document.hidden && !frame && model && !root.classList.contains('scene-fallback')) frame = requestAnimationFrame(animate);
  }
  function animate(now) {
    frame = 0;
    if (disposed || document.hidden) { last = 0; return; }
    const elapsed = last ? (now - last) / 1000 : 0;
    const dt = Math.min(.05, elapsed); last = now;
    if (!reduced) {
      intro = Math.min(1, intro + elapsed / 1.8);
      if (!paused && !leaving) lightTime = Math.min(47 / lighting.fps, lightTime + elapsed);
      if (!paused && !dragging && !leaving) {
        if (now / 1000 - lastInteraction > 3) velocityX += (.035 * dt - velocityX) * (1 - Math.exp(-dt * 2));
        rotationDelta.setFromAxisAngle(axisY, velocityX); targetRotation.premultiply(rotationDelta);
        rotationDelta.setFromAxisAngle(axisX, velocityY); targetRotation.premultiply(rotationDelta);
        velocityX *= Math.exp(-dt * 3.5); velocityY *= Math.exp(-dt * 4.5);
      }
      spin.quaternion.slerp(targetRotation, 1 - Math.exp(-dt * (dragging ? 25 : 11)));
      zoom += (zoomTarget - zoom) * (1 - Math.exp(-dt * 9));
      if (leaving) zoomTarget = 1.65;
      const entryScale = .93 + .07 * (1 - Math.pow(1 - intro, 3));
      spin.scale.setScalar(zoom * entryScale);
      stars.rotation.z += dt * .0008;
      mixer?.update(paused ? 0 : dt);
    } else {
      spin.quaternion.copy(targetRotation); spin.scale.setScalar(zoomTarget);
    }
    sampleLights(reduced ? 47 / lighting.fps : lightTime);
    renderer.render(scene, camera); state();
    // Reduced motion and pause draw only on explicit input, saving idle GPU work.
    if (!reduced && (!paused || dragging || Math.abs(zoom - zoomTarget) > .001 || spin.quaternion.angleTo(targetRotation) > .001)) schedule();
  }
  function rotate(dx, dy) {
    rotationDelta.setFromAxisAngle(axisY, dx); targetRotation.premultiply(rotationDelta);
    rotationDelta.setFromAxisAngle(axisX, dy); targetRotation.premultiply(rotationDelta);
    lastInteraction = performance.now() / 1000;
    if (reduced) { spin?.quaternion.copy(targetRotation); renderStill(); }
    schedule();
  }
  function pointerDown(event) {
    if (!model || (event.pointerType === 'mouse' && event.button !== 0)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    zone.setPointerCapture(event.pointerId); dragging = true; lastX = event.clientX; lastY = event.clientY;
    velocityX = velocityY = 0;
    if (pointers.size === 2) { const [a,b] = [...pointers.values()]; pinchDistance = Math.hypot(a.x-b.x,a.y-b.y); }
    schedule();
  }
  function pointerMove(event) {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      const [a,b] = [...pointers.values()], distance = Math.hypot(a.x-b.x,a.y-b.y);
      if (pinchDistance) zoomTarget = THREE.MathUtils.clamp(zoomTarget * distance / pinchDistance, .8, 1.35);
      pinchDistance = distance; schedule();
    } else {
      inputX = (event.clientX - lastX) * .006; inputY = (event.clientY - lastY) * .006;
      rotate(inputX, inputY); velocityX = inputX * .22; velocityY = inputY * .22;
    }
    lastX = event.clientX; lastY = event.clientY;
  }
  function pointerUp(event) {
    pointers.delete(event.pointerId); dragging = pointers.size > 0; pinchDistance = 0;
    const remaining = [...pointers.values()][0]; if (remaining) { lastX = remaining.x; lastY = remaining.y; }
    lastInteraction = performance.now() / 1000; schedule();
  }
  function keyDown(event) {
    if (!model) return;
    const arrows = { ArrowLeft: [-.13,0], ArrowRight: [.13,0], ArrowUp: [0,-.13], ArrowDown: [0,.13] };
    if (arrows[event.key]) { event.preventDefault(); rotate(...arrows[event.key]); }
    else if (['+','=','-','_'].includes(event.key)) { event.preventDefault(); zoomTarget = THREE.MathUtils.clamp(zoomTarget + (event.key === '-' || event.key === '_' ? -.08 : .08), .8,1.35); schedule(); }
    else if (event.key === 'Home') { event.preventDefault(); api.reset(); }
  }
  const observer = new ResizeObserver(resize);
  const api = {
    setReducedMotion(value) {
      reduced = value; root.classList.toggle('orbital-reduced', reduced);
      if (reduced) { lightTime = 47 / lighting.fps; velocityX = velocityY = 0; sampleLights(lightTime); }
      renderStill(); schedule();
    },
    setPaused(value) { paused = value; velocityX = velocityY = 0; last = 0; state(); schedule(); },
    replayLights() { if (reduced) return; lightTime = 0; paused = false; last = 0; schedule(); },
    reset() { targetRotation.copy(initialRotation); zoomTarget = 1; velocityX = velocityY = 0; if (reduced) { spin?.quaternion.copy(targetRotation); spin?.scale.setScalar(1); renderStill(); } schedule(); },
    depart() { leaving = true; schedule(); },
    dispose() {
      disposed = true; abort.abort(); observer.disconnect(); if (frame) cancelAnimationFrame(frame);
      mixer?.stopAllAction();
      scene?.traverse(object => {
        if (object.geometry) assets.add(object.geometry);
        for (const material of Array.isArray(object.material) ? object.material : object.material ? [object.material] : []) {
          for (const value of Object.values(material)) if (value?.isTexture) { value.source?.data?.close?.(); assets.add(value); }
          assets.add(material);
        }
      });
      assets.forEach(asset => asset.dispose()); renderer?.dispose(); renderer?.forceContextLoss(); host.replaceChildren();
    },
  };
  root.classList.toggle('orbital-reduced', reduced);
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x06080b, 0); renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.3;
    host.append(renderer.domElement); renderer.domElement.setAttribute('aria-hidden','true');
    renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback(); }, options);
    scene = new THREE.Scene();
    // A soft local sky reflection keeps the supplied metal from rendering black.
    const skyFaces = ['#9cb4c1','#8ca5b5','#e3ebea','#596f7a','#bdcfd4','#91acb8'].map(color=>{
      const canvas=document.createElement('canvas');canvas.width=canvas.height=16;
      const context=canvas.getContext('2d');context.fillStyle=color;context.fillRect(0,0,16,16);return canvas;
    });
    const sky = new THREE.CubeTexture(skyFaces); sky.colorSpace=THREE.SRGBColorSpace;sky.needsUpdate=true;
    scene.environment=sky;scene.environmentIntensity=.6;assets.add(sky);
    camera = new THREE.PerspectiveCamera(34,1,.05,50);
    spin = new THREE.Group(); spin.name = 'Menu interaction around Empty.001'; spin.quaternion.copy(initialRotation); scene.add(spin);
    scene.add(new THREE.HemisphereLight(0xe4f1ff, 0x658395, 1.75));
    // Separate presentation fill keeps the Moon readable after the authored effects fade.
    const key = new THREE.DirectionalLight(0xfff4de, 3.6); key.position.set(-3,2.5,4); scene.add(key);
    const rim = new THREE.DirectionalLight(0xc5ebff, 2.2); rim.position.set(3,.4,-3); scene.add(rim);
    for (const spec of lighting.lights) {
      const light = new THREE.PointLight(0xffffff,0,0,2); light.name = spec.name;
      // Parented effect lights turn with the model; the author's world light stays fixed.
      (spec.parent ? spin : scene).add(light); lights.push(light);
    }
    // Fine orbital trajectories are spatial geometry, occluded naturally by the Moon.
    for (let i=0; i<2; i++) {
      const points = Array.from({length:193},(_,j) => { const a=j/192*Math.PI*2; return new THREE.Vector3(Math.cos(a)*(1.5+i*.12),Math.sin(a)*(1.5+i*.12),0); });
      const orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:i?0x678c93:0xb9c8a6,transparent:true,opacity:i?.09:.18}));
      orbit.rotation.set(1.08+i*.22,.15+i*.25,-.36+i*.2); scene.add(orbit);
    }
    const positions = new Float32Array(550*3);
    let seed = 604;
    const random = () => { seed = (Math.imul(1664525,seed)+1013904223)>>>0; return seed/4294967296; };
    for (let i=0;i<positions.length;i+=3) { positions[i]=(random()-.5)*22; positions[i+1]=(random()-.5)*18; positions[i+2]=-6-random()*8; }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    stars = new THREE.Points(geometry,new THREE.PointsMaterial({color:0xe7f5ef,size:.024,sizeAttenuation:true,transparent:true,opacity:.6})); scene.add(stars);
    const crossPositions=[];
    for(let i=0;i<positions.length;i+=66) {
      const x=positions[i], y=positions[i+1], z=positions[i+2], r=.022;
      crossPositions.push(x-r,y,z,x+r,y,z,x,y-r,z,x,y+r,z);
    }
    const crossGeometry=new THREE.BufferGeometry();crossGeometry.setAttribute('position',new THREE.Float32BufferAttribute(crossPositions,3));
    scene.add(new THREE.LineSegments(crossGeometry,new THREE.LineBasicMaterial({color:0xe2f0da,transparent:true,opacity:.7})));
    const diamondPositions=[];
    for(let i=33;i<positions.length;i+=99) {
      const x=positions[i], y=positions[i+1], z=positions[i+2], r=.025;
      diamondPositions.push(x,y+r,z,x+r*.6,y,z,x+r*.6,y,z,x,y-r,z,x,y-r,z,x-r*.6,y,z,x-r*.6,y,z,x,y+r,z);
    }
    const diamondGeometry=new THREE.BufferGeometry();diamondGeometry.setAttribute('position',new THREE.Float32BufferAttribute(diamondPositions,3));
    scene.add(new THREE.LineSegments(diamondGeometry,new THREE.LineBasicMaterial({color:0xe4f5e0,transparent:true,opacity:.65})));
    sampleLights(reduced ? 47/lighting.fps : 0);
    observer.observe(root);
    zone.addEventListener('pointerdown',pointerDown,options); zone.addEventListener('pointermove',pointerMove,options);
    zone.addEventListener('pointerup',pointerUp,options); zone.addEventListener('pointercancel',pointerUp,options); zone.addEventListener('lostpointercapture',pointerUp,options);
    zone.addEventListener('keydown',keyDown,options);
    zone.addEventListener('wheel',event => { if(!model) return; event.preventDefault(); zoomTarget = THREE.MathUtils.clamp(zoomTarget-event.deltaY*.0007,.8,1.35); schedule(); }, { ...options, passive:false });
    document.addEventListener('visibilitychange',() => { last = 0; if(document.hidden) { if(frame) cancelAnimationFrame(frame); frame=0; } else schedule(); },options);
    moonBinary().then(buffer => new GLTFLoader().parseAsync(buffer,'')).then(gltf => {
      if (disposed) { gltf.scene.traverse(o => { o.geometry?.dispose(); for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]) { for(const value of Object.values(m)) if(value?.isTexture) {value.source?.data?.close?.();value.dispose();} m.dispose(); } }); return; }
      model = gltf.scene; pivot = model.getObjectByName('Empty.001') || model.getObjectByName('Empty001');
      const moon = model.getObjectByName('Sphere');
      if (!pivot || !moon) throw new Error('Missing Moon hierarchy');
      model.updateMatrixWorld(true);
      const origin = pivot.getWorldPosition(new THREE.Vector3());
      const bounds = new THREE.Box3().setFromObject(moon), size = bounds.getSize(new THREE.Vector3());
      const radius = Math.max(size.x,size.y,size.z)/2;
      model.position.sub(origin); model.scale.multiplyScalar(1/radius);
      model.updateMatrixWorld(true);
      const campus = new THREE.Group(); campus.name = 'Connected lunar campus';
      const stationNames = new Set(['Cube','Cylinder','HDU_lowRez_part1','Icosphere','Icosphere.002','Plane','Plane.001','Plane.002']);
      const panels = [];
      model.traverse(object => {
        const originalName=object.userData.name||object.name;
        if(!object.isMesh)return;
        if(stationNames.has(originalName)) {
          const geometry=object.geometry.clone().applyMatrix4(object.matrixWorld).applyMatrix4(campusMatrix);
          const part=new THREE.Mesh(geometry,object.material);part.name=originalName;campus.add(part);object.visible=false;
        } else if(originalName.startsWith('Acrimsat_vFINAL')) panels.push(object);
      });
      // Keep the source's four buildings and all connecting corridors together.
      // Their smaller, grounded footprint follows a tangent of the lunar surface.
      spin.add(campus);
      if(panels.length) {
        const panelBounds=new THREE.Box3();panels.forEach(o=>panelBounds.union(new THREE.Box3().setFromObject(o)));
        const panelCenter=panelBounds.getCenter(new THREE.Vector3());
        const arrayNormal=new THREE.Vector3(.38,.70,-.62).normalize();
        const arrayQuaternion=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),arrayNormal);
        const arrayMatrix=new THREE.Matrix4().compose(arrayNormal.clone().multiplyScalar(1.015),arrayQuaternion,new THREE.Vector3(.00036,.00036,.00036)).multiply(new THREE.Matrix4().makeTranslation(-panelCenter.x,-panelCenter.y,-panelCenter.z));
        const array=new THREE.Group();array.name='Surface solar array';
        panels.forEach(object=>{const geometry=object.geometry.clone().applyMatrix4(object.matrixWorld).applyMatrix4(arrayMatrix);array.add(new THREE.Mesh(geometry,object.material));object.visible=false;});
        spin.add(array);
      }
      const exportedLights=[];
      model.traverse(object => {
        if (object.isLight) exportedLights.push(object);
        if (object.isMesh) {
          const box=new THREE.Box3().setFromObject(object), center=box.getCenter(new THREE.Vector3());
          if (center.distanceTo(origin)>radius*3) object.visible=false;
          for (const material of Array.isArray(object.material)?object.material:[object.material]) {
            if(material.map) material.map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
          }
        }
      });
      exportedLights.forEach(light=>light.removeFromParent()); spin.add(model);
      if(gltf.animations.length) { mixer=new THREE.AnimationMixer(model); gltf.animations.forEach(clip=>mixer.clipAction(clip).play()); }
      root.dataset.moonPivot = 'Empty.001'; root.dataset.stationLayout = 'surface-campus'; root.dataset.animationClips = String(gltf.animations.length);
      root.dataset.sceneState = 'ready'; root.querySelector('#moon-status').textContent = 'LUNAR LINK ESTABLISHED';
      resize(); schedule();
    }).catch(fallback);
    resize();
  } catch { fallback(); }
  return api;
}
