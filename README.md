# create-api

> -   可通过 `api` 方式调用
>     -   可将 `vue` 组件挂载到全局实例上供全局调用
>     -   通过 `useComponent` 函数调用 `vue` 组件

[在线demo](https://xiaohaih.github.io/create/)

## 安装

<details>
<summary>点击展开</summary>

> #### 基于 `npm`
>
> `pnpm`
>
> ```bash
> pnpm i -S @xiaohaih/create-api
> ```
>
> `npm`
>
> ```bash
> npm install @xiaohaih/create-api
> ```
>
> `yarn`
>
> ```bash
> yarn add @xiaohaih/create-api
> ```

> #### 基于 `cdn`
>
> ```html
> <script src="https://unpkg.com/@xiaohaih/create/dist/index.umd.cjs"></script>
> ```

</details>

## 使用 - 通过函数调用

```vue
<script lang="ts" setup>
import { useComponent } from '@xiaohaih/create-api';

const dialogComponent = useComponent(HDialog);

function clickHandle() {
    dialogComponent({
        title: '显示弹窗',
    }).show();
}
</script>
```

## 使用 - 挂载到 `vue` 实例上

<details>
<summary>点击展开</summary>

> `main.ts`

```js
import { createApp } from 'vue';
import { install } from '@xiaohaih/create-api';

const app = createApp(App);
app.use(install);
```

> `a.vue`

```js
import { create } from '@xiaohaih/create-api';
import Dialog from './components/dialog.vue';

// 直接挂载弹窗
create(Dialog);
// 或者通过实例挂载弹窗
// getCurrentInstance()?.proxy?.$create(Lump);

// 在 js 中调用, 默认不具备响应式
// 如要支持响应式, props 应为 ref 或 reactive
Dialog.$create({
    title: 'test',
    content: '内容',
}).show();

// 在 vue 组件中可以通过 getCurrentInstance 调用
getCurrentInstance()?.proxy?.$createDialog({
    title: 'test',
    content: '内容',
}).show();
```

> `src/types/create.d.ts`

```js
// 为全局组件补充声明
import type { CreateFn } from '@xiaohaih/create-api';
import type Dialog from '@/components/dialog.vue';

declare module 'vue' {
    interface ComponentCustomProperties {
        $createDialog: CreateFn<typeof Dialog>;
    }
}
```

</details>

## 导出的函数

### `install(vueApp, [options])` 全局安装方法

> -   参数:
>     -   {Vue} vueApp 全局实例
>     -   {object} [`options`] 可选配置项
>     -   {boolean} [`options.single`] 是否作为当前上下文中的单例, 默认 `true`
>     -   {boolean} [`options.global`] 是否将组件挂载到根实例上
>     -   {boolean} [`options.mergeProps`] 重复调用时是否与上次调用时传的 `props` 进行合并
>     -   {string | Element | (() => Element)} [`options.appendTo`] 挂载到的节点, 默认 `document.body`
> -   tips:
>     -   会为全局数据上增加 `$create` 方法, `$create` 等同下方的 `create`

### `useComponent` 通过 `js` 方式挂载组件

> -   参数
>     -   {VueComponent} `component` 需要挂载的组件
>     -   {object | VueInstance} [`options` | `instance`] 传递的配置项(与 install 第二个参数相同), 无配置项时可传第三个参数
>     -   {VueInstance} [`instance`] 挂载时绑定到的实例
> -   返回值
>     -   {(`props`: 传给组件的参数, `children`: 插槽或子级) => `CustomComponent`} 调用 `useComponent` 后的返回值
>     -   `CustomComponent` 是 `component` 的实例, 在实例上增加了四个方法👇
>         -   {() => `CustomComponent`} `show` 显示组件(需内部实现 `show` 方法)
>         -   {() => `CustomComponent`} `hide` 隐藏组件(需内部实现 `hide` 方法)
>         -   {() => void} `$unmount` 卸载组件
>         -   {(`props`: object | null, `mergeProps`?: boolean) => `CustomComponent`} `$updateProps` 手动更新参数

### `create` 执行后返回组件自身

> -   tips:
>     -   会为组件创建 `$create` 方法, 组件可调用自身的 `$create` 来挂载组件
>     -   为全局注册 `$create组件名称`(小驼峰) 方法, 通过该方法亦可创建组件
>         -   参数
>             -   {object | null} [`props`] 传递给组件的参数
>             -   {Function|object} [`children`] 子级或插槽
>             -   {object} [`options`] 传递的配置项(与 install 第二个参数相同)
