import { defineConfig } from 'vite';
export default defineConfig({
  base:'./',
  plugins:[{name:'source-entry',configureServer(server){
    server.middlewares.use((req,_res,next)=>{
      if(req.url==='/'||req.url?.startsWith('/?'))req.url='/dev.html'+req.url.slice(1);
      next();
    });
  }}],
  server:{port:4173,strictPort:true},
  build:{target:'es2022',rollupOptions:{input:'dev.html'}},
});
