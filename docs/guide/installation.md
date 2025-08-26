# 安装指南

## 环境要求

- Node.js >= 16.0.0
- Vue >= 3.0.0

## 安装方式

### NPM 安装

```bash
npm install @xiaohaih/create-api
```

### Yarn 安装

```bash
yarn add @xiaohaih/create-api
```

### PNPM 安装

```bash
pnpm add @xiaohaih/create-api
```

### CDN 引入

```html
<script src="https://unpkg.com/@xiaohaih/create-api/dist/index.umd.cjs"></script>
```

## TypeScript 配置

### 1. 全局类型声明

在 `tsconfig.json` 中添加类型声明：

```json
{
    "compilerOptions": {
        "types": ["@xiaohaih/create-api/global"],
    },
}
```

### 2. 组件类型声明

为全局组件补充类型声明，创建 `src/types/create.d.ts`：

```ts
import type Dialog from '@/components/dialog.vue';
import type { CreateFn } from '@xiaohaih/create-api';

declare module 'vue' {
    interface ComponentCustomProperties {
        $createDialog: CreateFn<typeof Dialog>;
    }
}
```

## 基础配置

### 1. 全局安装

在 `main.ts` 中进行全局安装：

```ts
import { install } from '@xiaohaih/create-api';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// 基础安装
app.use(install);

// 带配置的安装
app.use(install, {
    single: true,
    mergeProps: false,
    appendTo: document.body
});

app.mount('#app');
```

### 2. 组件注册

在组件中注册需要全局调用的组件：

```ts
import { create } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

// 注册组件
create(Dialog);
```

## 验证安装

安装完成后，可以通过以下方式验证：

```ts
import { useComponent } from '@xiaohaih/create-api';

// 检查是否正常导入
console.log(useComponent); // 应该输出函数
```
