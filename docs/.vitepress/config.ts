import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'vue-create-api',
    description: '通过 JavaScript 挂载 Vue 组件的轻量级工具库',
    vite: {
        server: { port: 2230 },
        preview: { port: 2231 },
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            { text: '指南', link: '/guide/installation' },
            { text: 'API', link: '/api/' },
            { text: '示例', link: '/examples/basic-dialog' },
            { text: 'GitHub', link: 'https://github.com/xiaohaiH/create' },
        ],

        sidebar: {
            '/guide/': [
                {
                    text: '指南',
                    items: [
                        { text: '安装指南', link: '/guide/installation' },
                        { text: '基础用法', link: '/guide/basic-usage' },
                        { text: '高级用法', link: '/guide/advanced' },
                    ],
                },
            ],
            '/api/': [
                {
                    text: 'API 参考',
                    items: [
                        { text: '概述', link: '/api/' },
                        { text: 'install 函数', link: '/api/install' },
                        { text: 'useComponent 函数', link: '/api/use-component' },
                        { text: 'create 函数', link: '/api/create' },
                        { text: '类型定义', link: '/api/types' },
                    ],
                },
            ],
            '/examples/': [
                {
                    text: '示例',
                    items: [
                        { text: '基础弹窗', link: '/examples/basic-dialog' },
                    ],
                },
            ],
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/xiaohaiH/create' },
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2024-present xiaohaih',
        },

        search: {
            provider: 'local',
        },
    },

    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['meta', { name: 'keywords', content: 'vue,create-api,component,typescript' }],
    ],

    markdown: {
        theme: 'material-theme-palenight',
        lineNumbers: true,
    },
});
