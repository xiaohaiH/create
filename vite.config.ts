import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    // vite 配置
    plugins: [
        vue(),
        vueJsx({
        }),
        UnoCSS({ hmrTopLevelAwait: false }),
        tsconfigPaths(),
    ],
});
