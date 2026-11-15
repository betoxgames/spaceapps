/** Import every supplied PNG, preserving frame order and a fixed camera/foot pivot.
 * Run download-team-renders.py first. Originals stay in ignored asset-sources.
 * Runtime images are resized for a 500px-tall person and encoded losslessly.
 */
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const source=path.join(root,'asset-sources/team-renders');
const jobs=JSON.parse(await readFile(path.join(source,'downloads.json'),'utf8'));
const output=path.join(root,'public/art/engineers');
await mkdir(output,{recursive:true});
const runtime={},engineers={};
const columns=8,cellHeight=544,footY=520;
const clips={idle:'idle',arrive:'hablar',approve:'aprobado',return:'no aprobado'};
const sha=data=>createHash('sha256').update(data).digest('hex');
function bounds(data,width,height,channels=4,threshold=0){
 let left=width,top=height,right=-1,bottom=-1,transparent=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const a=data[(y*width+x)*channels+3];if(a===0)transparent++;
  if(a>threshold){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 }
 if(right<0)throw Error('Empty frame');
 return {left,top,right,bottom,transparent};
}
for(const slug of [...new Set(jobs.map(j=>j.slug))].sort()){
 const frames=[],audit={};let union={left:1920,top:1080,right:0,bottom:0};
 for(const [name,folder] of Object.entries(clips)){
  const ordered=jobs.filter(j=>j.slug===slug&&j.clip===folder).sort((a,b)=>a.name.localeCompare(b.name));
  if(!ordered.length)throw Error(`Missing ${slug}/${folder}`);
  const sourceFrames=[];
  for(let index=0;index<ordered.length;index++){
   const job=ordered[index];if(Number.parseInt(job.name)!==index+1)throw Error(`Sequence gap: ${slug}/${folder}`);
   const file=path.join(source,slug,folder,job.name),png=await readFile(file);
   const metadata=await sharp(png).metadata();
   if(metadata.width!==1920||metadata.height!==1080||!metadata.hasAlpha)throw Error(`Unexpected canvas/alpha: ${slug}/${folder}/${job.name}`);
   const {data,info}=await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true});
   const box=bounds(data,info.width,info.height);if(box.transparent===0)throw Error('Opaque source background');
   for(const edge of ['left','top'])union[edge]=Math.min(union[edge],box[edge]);
   for(const edge of ['right','bottom'])union[edge]=Math.max(union[edge],box[edge]);
   frames.push({name,file,box});
   sourceFrames.push({file:job.name,driveId:job.id,bytes:png.length,sha256:sha(png),alphaBounds:box});
  }
  audit[name]={folderId:ordered[0].folder,frames:sourceFrames,sourceCanvas:[1920,1080],durationMs:ordered.length/24*1000};
 }
 // One pivot for all poses: source camera registration remains unchanged.
 const idle=frames.filter(f=>f.name==='idle');
 const idleBaseline=Math.max(...idle.map(f=>f.box.bottom))+1;
 const baseline=Math.max(idleBaseline,union.bottom+1);
 const first=await sharp(idle[0].file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let footLeft=1920,footRight=0;
 for(let y=baseline-70;y<baseline;y++)for(let x=0;x<1920;x++)if(first.data[(y*1920+x)*4+3]>16){footLeft=Math.min(footLeft,x);footRight=Math.max(footRight,x);}
 const pivot=(footLeft+footRight)/2;
 const scale=500/(baseline-union.top);
 const halfWidth=Math.ceil(Math.max(pivot-union.left,union.right+1-pivot)*scale)+4;
 const cellWidth=Math.ceil(halfWidth*2/2)*2;
 const items=[],metadataClips={};let row=0;
 for(const name of Object.keys(clips)){
  const selected=frames.filter(f=>f.name===name);
  metadataClips[name]={offset:row*columns,frames:selected.length,duration:selected.length/24*1000,loop:name==='idle'};
  for(let i=0;i<selected.length;i++){
   const box=selected[i].box;
   const crop={left:box.left,top:box.top,width:box.right-box.left+1,height:box.bottom-box.top+1};
   const width=Math.round(crop.width*scale),height=Math.round(crop.height*scale);
   const input=await sharp(selected[i].file).extract(crop).resize(width,height,{kernel:'lanczos3'}).png().toBuffer();
   const left=Math.round(cellWidth/2+(crop.left-pivot)*scale),top=Math.round(footY+(crop.top-baseline)*scale);
   if(left<0||top<0||left+width>cellWidth||top+height>cellHeight)throw Error(`Crop exceeds cell: ${slug}/${name}`);
   items.push({input,frame:row*columns+i,left,top,width,height});
  }
  row+=Math.ceil(selected.length/columns);
 }
 // No new walking PNG was delivered. Re-render the original, compatible
 // caminar cycle consecutively (86–125), rather than sparse whole-action samples.
 const walkRoot=path.join(root,'asset-sources/walk-renders',slug);
 const walkManifest=JSON.parse(await readFile(path.join(walkRoot,'manifest.json'),'utf8'));
 const reference=walkManifest.reference.alphaBounds;
 const walkPivot=(walkManifest.reference.lowestVisibleFootSpan[0]+walkManifest.reference.lowestVisibleFootSpan[1])/2;
 const walkBaseline=reference.bottom+1;
 const idleHeight=(idleBaseline-Math.min(...idle.map(f=>f.box.top)))*scale;
 const walkScale=idleHeight/(reference.bottom-reference.top+1);
 const walkFootY=footY+(idleBaseline-baseline)*scale;
 metadataClips.depart={offset:row*columns,frames:walkManifest.frames.length,duration:walkManifest.durationMs,loop:true};
 for(let i=0;i<walkManifest.frames.length;i++){
  const original=await readFile(path.join(walkRoot,walkManifest.frames[i].file));
  const {data,info}=await sharp(original).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  if(info.width!==512||info.height!==512)throw Error('Unexpected walk canvas');
  const box=bounds(data,512,512);
  const crop={left:box.left,top:box.top,width:box.right-box.left+1,height:box.bottom-box.top+1};
  const width=Math.round(crop.width*walkScale),height=Math.round(crop.height*walkScale);
  const input=await sharp(original).extract(crop).resize(width,height).png().toBuffer();
  const left=Math.round(cellWidth/2+(crop.left-walkPivot)*walkScale),top=Math.round(walkFootY+(crop.top-walkBaseline)*walkScale);
  if(left<0||top<0||left+width>cellWidth||top+height>cellHeight)throw Error(`Walk exceeds cell: ${slug}/${i}: ${left},${top},${width},${height}`);
  items.push({input,frame:row*columns+i,left,top,width,height});
 }
 row+=Math.ceil(walkManifest.frames.length/columns);
 // Shelf-pack only visible rectangles. Virtual cell registration stays fixed,
 // but browsers no longer decode huge repeated transparent cell margins.
 const file=slug+'.webp';let width=2048,height,packed,packedFrames;
 do{
  packedFrames={};let packX=0,packY=0,shelfHeight=0;
  packed=items.map(item=>{
   if(item.width+4>width)throw Error('Frame wider than packed atlas');
   if(packX+item.width+4>width){packX=0;packY+=shelfHeight+4;shelfHeight=0;}
   const x=packX+2,y=packY+2;
   packedFrames[item.frame]={x,y,width:item.width,height:item.height,left:item.left,top:item.top};
   packX+=item.width+4;shelfHeight=Math.max(shelfHeight,item.height);
   return {input:item.input,left:x,top:y};
  });
  height=packY+shelfHeight+4;
  if(height>16383){width*=2;if(width>8192)throw Error('Packed WebP exceeds dimension limit');}
  else break;
 }while(true);
 await sharp({create:{width,height,channels:4,background:'#00000000'}}).composite(packed).webp({lossless:true,effort:4}).toFile(path.join(output,file));
 const bytes=await readFile(path.join(output,file));
 runtime[slug]={file,width,height,cellWidth,cellHeight,footY,columns,packedFrames,clips:metadataClips};
 engineers[slug]={...runtime[slug],bytes:bytes.length,sha256:sha(bytes),registration:{sourcePivotX:pivot,sourceFootY:baseline,idleFootY:idleBaseline,sourceBounds:union,scale,outputFoot:[cellWidth/2,footY]},clips:audit,walk:{...walkManifest,registration:{scale:walkScale,sourcePivotX:walkPivot,sourceFootY:walkBaseline,outputFootY:walkFootY}}};
 console.log(`${slug}: ${frames.length} supplied PNGs, ${width}x${height}, ${(bytes.length/1024/1024).toFixed(2)} MB`);
}
await writeFile(path.join(root,'src/engineer-clips.json'),JSON.stringify(runtime,null,2)+'\n');
await writeFile(path.join(output,'manifest.json'),JSON.stringify({format:'team-render-packed-atlases-v2',sourceFolder:'https://drive.google.com/drive/folders/18ary3tO44csa7YWqPtnE2IqQTt2BXYRN',encoding:'WebP lossless after display-resolution resampling; all supplied frames retained',fps:24,fpsEvidence:'Assumed from the original Blender animation template (24 fps). PNG sequences do not encode playback fps; confirm with art team.',warnings:['No new walk renders present in any of the nine engineer folders: original compatible caminar cycle re-rendered, frames 86–125 at 24 fps; source has stylized airborne steps and a small loop seam.','Door upper geometry remains incomplete; scene masking/layering is temporary, not a model repair.'],engineers},null,2)+'\n');
