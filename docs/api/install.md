# install 函数

全局安装函数，为 Vue 应用添加 `$create` 方法。

## 函数签名

```ts
function install<T extends App>(app: T, options?: Option): void;
```

## 参数

| 参数      | 类型            | 必需 | 描述         |
| --------- | --------------- | ---- | ------------ |
| `app`     | `T extends App` | 是   | Vue 应用实例 |
| `options` | `Option`        | 否   | 全局配置选项 |

## 返回值

`void` - 无返回值

## 配置选项

### Option 接口

```ts
interface Option {
    /** 是否作为当前上下文中的单例 @default true */
    single?: boolean;
    /** 是否直接取根实例作为上下文(无法被动销毁组件, 只能手动销毁) */
    global?: boolean;
    /** 组件重复调用时是否合并上之前的 props */
    mergeProps?: boolean;
    /** 元素挂载的节点 @default document.body */
    appendTo?: string | Element | Node | (() => Element | Node);
}
```

### 配置项说明

| 属性         | 类型                                                   | 默认值          | 描述                                          |
| ------------ | ------------------------------------------------------ | --------------- | --------------------------------------------- |
| `single`     | `boolean`                                              | `true`          | 是否作为当前上下文中的单例                    |
| `global`     | `boolean`                                              | `false`         | 是否将组件挂载到根实例上                      |
| `mergeProps` | `boolean`                                              | `false`         | 重复调用时是否与上次调用时传的 props 进行合并 |
| `appendTo`   | `string \| Element \| Node \| (() => Element \| Node)` | `document.body` | 挂载到的节点                                  |

## 使用示例

### 基础安装

```ts
import { install } from '@xiaohaih/create-api';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// 基础安装
app.use(install);

app.mount('#app');
```

### 带配置的安装

```ts
import { install } from '@xiaohaih/create-api';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// 带配置的安装
app.use(install, {
    single: true, // 单例模式
    global: false, // 不挂载到根实例
    mergeProps: false, // 不合并 props
    appendTo: document.body // 挂载到 body
});

app.mount('#app');
```

### 自定义挂载节点

```ts
import { install } from '@xiaohaih/create-api';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// 挂载到指定容器
app.use(install, {
    appendTo: '#app-container' // 挂载到 id 为 app-container 的元素
});

// 或者挂载到函数返回的节点
app.use(install, {
    appendTo: () => document.querySelector('.custom-container')
});

app.mount('#app');
```

## 全局方法

安装后，会在 Vue 应用实例上添加以下全局方法：

### $create

全局的组件创建方法，等同于 `create` 函数。

```ts
// 在组件中使用
getCurrentInstance()?.proxy?.$create(Component, props, children);
```

## 注意事项

1. **重复安装**: 同一个应用实例多次调用 `install` 不会重复安装
2. **配置优先级**: 全局配置会被组件级别的配置覆盖
3. **生命周期**: 全局挂载的组件不会随组件销毁而自动销毁
4. **内存管理**: 使用 `global: true` 时需要注意手动清理组件实例

## 错误处理

```ts
import { install } from '@xiaohaih/create-api';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

try {
    app.use(install, {
        appendTo: '#non-existent-element' // 不存在的元素
    });
}
catch (error) {
    console.error('安装失败:', error);
    // 使用默认配置
    app.use(install);
}

app.mount('#app');
```

## 最佳实践

1. **配置集中化**: 在应用入口统一配置全局选项
2. **环境适配**: 根据环境设置不同的挂载节点
3. **错误处理**: 对可能失败的配置进行错误处理
4. **性能考虑**: 合理使用 `single` 和 `global` 选项
