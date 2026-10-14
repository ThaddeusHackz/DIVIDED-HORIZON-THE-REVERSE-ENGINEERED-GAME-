import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({server:{host:'0.0.0.0',allowedHosts:['.e2b.app']},build:{chunkSizeWarningLimit:700,rollupOptions:{input:{game:resolve(import.meta.dirname,'index.html'),assets:resolve(import.meta.dirname,'asset-lab.html')}}}});
