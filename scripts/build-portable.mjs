// Build a self-contained offline snapshot from the Vite production output.
// Run: pnpm build && node scripts/build-portable.mjs
import {readFile, readdir, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
const dist=resolve('dist');
const list=await readdir(join(dist,'assets'));
const unique=(extension)=>{const found=list.filter(x=>x.endsWith(extension));if(found.length!==1)throw Error(`Expected one ${extension} bundle, found ${found.length}`);return found[0];};
let html=await readFile(join(dist,'index.html'),'utf8');
let js=await readFile(join(dist,'assets',unique('.js')),'utf8');
let css=await readFile(join(dist,'assets',unique('.css')),'utf8');
const scene=join(dist,'art','scene'), images={};
for(const name of await readdir(scene))if(name.endsWith('.webp'))images[name]='data:image/webp;base64,'+(await readFile(join(scene,name))).toString('base64');
css=css.replace(/url\(["']?\.\.\/art\/scene\/([^)'" ]+)["']?\)/g,(_,name)=>{if(!images[name])throw Error('Missing scene: '+name);return `url("${images[name]}")`;});
const door=/new URL\(`art\/scene\/door-\$\{([\w$]+)\}\.webp`,document\.baseURI\)\.href/g;
if(!door.test(js))throw Error('Door asset pattern changed; update portable generator');
js=js.replace(door,(_,v)=>`(${JSON.stringify(images)})[\`door-\${${v}}.webp\`]`);
const science='data:application/json;base64,'+(await readFile(join(dist,'science.json'))).toString('base64');
const source='new URL("science.json",document.baseURI)';if(!js.includes(source))throw Error('Science asset pattern changed; update portable generator');
js=js.replace(source,JSON.stringify(science));
const script=/<script type="module" crossorigin src="[^"]+"><\/script>/,style=/<link rel="stylesheet" crossorigin href="[^"]+">/;
if(!script.test(html)||!style.test(html))throw Error('Unexpected Vite output');
html=html.replace(script,()=>'<script type="module">'+js.replaceAll('</script','<\\/script')+'</script>').replace(style,()=>'<style>'+css+'</style>');
await writeFile('Space-Papers.html',html);
console.log('Wrote Space-Papers.html ('+Buffer.byteLength(html)+' bytes)');
