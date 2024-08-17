
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import Terminal from 'vite-plugin-terminal'

const workerImportMetaUrlRE = /\bnew\s+(?:Worker|SharedWorker)\s*\(\s*(new\s+URL\s*\(\s*('[^']+'|"[^"]+"|`[^`]+`)\s*,\s*import\.meta\.url\s*\))/g;

export default defineConfig({
    server: {https: true},
    plugins: [ 
        mkcert(),
        Terminal({
            output: ['terminal', 'console']
          })
     ],
    base: "/cuboost",
    worker: {
        format: 'es',
        plugins: () => [
            {
                name: 'disable-nested-workers',
                enforce: 'pre',
                transform(code, id) {
                    if (code.includes('new Worker') && code.includes('new URL') && code.includes('import.meta.url')) {
                        const result = code.replace(workerImportMetaUrlRE, `((() => { throw new Error('Nested workers are disabled') })()`);
                        return result;
                    }
                }
            }
        ],
        rollupOptions: {
            output: {
                chunkFileNames: 'assets/worker/[name]-[hash].js',
                assetFileNames: 'assets/worker/[name]-[hash].js'
            }
        }
    }
});

