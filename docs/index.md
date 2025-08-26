---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "vue-create-api"
  text: "通过js挂载vue组件"
  # tagline: My great project tagline
  # actions:
  #   - theme: brand
  #     text: Markdown Examples
  #     link: /markdown-examples
  #   - theme: alt
  #     text: API Examples
  #     link: /api-examples

# features:
#   - title: Feature A
#     details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
#   - title: Feature B
#     details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
#   - title: Feature C
#     details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---

# vue-create-api

> 通过 JavaScript 挂载 Vue 组件的轻量级工具库

[![npm version](https://img.shields.io/npm/v/@xiaohaih/create-api.svg)](https://www.npmjs.com/package/@xiaohaih/create-api)

[![npm downloads](https://img.shields.io/npm/dm/@xiaohaih/create-api.svg)](https://www.npmjs.com/package/@xiaohaih/create-api)

## 特性

- 🚀 **轻量级**: 体积小巧，无额外依赖
- 🎯 **类型安全**: 完整的 TypeScript 支持
- 🔧 **灵活配置**: 支持多种挂载方式和配置选项
- 🎨 **易于使用**: 简洁的 API 设计
- 🔄 **响应式**: 支持响应式 props 更新
- 🎪 **单例模式**: 支持组件单例管理

## 快速开始

### 安装

```bash
# 使用 npm
npm install @xiaohaih/create-api

# 使用 yarn
yarn add @xiaohaih/create-api

# 使用 pnpm
pnpm add @xiaohaih/create-api
```

### 基础使用

```vue
<template>
    <button @click="showDialog">
        显示弹窗
    </button>
</template>

<script setup lang="ts">
import { useComponent } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

const dialogComponent = useComponent(Dialog);

function showDialog() {
    dialogComponent({
        title: '提示',
        content: '这是一个弹窗'
    }).show();
}
</script>
```

## 核心功能

### 1. 函数式调用

通过 `useComponent` 函数直接调用组件，无需在模板中声明。

### 2. 全局挂载

将组件挂载到 Vue 实例上，支持全局调用。

### 3. 动态更新

支持动态更新组件的 props 和插槽内容。

### 4. 生命周期管理

自动管理组件的挂载、更新和卸载。

## 在线演示

访问 [在线演示](https://xiaohaih.github.io/create/) 查看完整的使用示例。

## 文档导航

- [安装指南](./guide/installation.md) - 详细的安装说明
- [基础用法](./guide/basic-usage.md) - 基础使用教程
- [API 参考](./api/) - 完整的 API 文档
- [高级用法](./guide/advanced.md) - 高级配置和技巧
- [示例代码](./examples/basic-dialog.md) - 丰富的使用示例

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
