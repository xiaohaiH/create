import { defineConfig, presetAttributify, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss';

/** 定义 unocss 配置 */
export default defineConfig({
    presets: [
        presetUno(),
        presetAttributify(),
    ],
    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
    ],
    rules: [
    ],
    shortcuts: [
        {
            ellipsis: 'overflow-hidden ws-nowrap text-ellipsis',
            center: 'flex items-center justify-center',
        },
    ],
});
