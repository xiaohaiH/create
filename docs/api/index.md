# API 参考

## 核心函数

### install

全局安装函数，为 Vue 应用添加 `$create` 方法。

```ts
function install<T extends App>(app: T, options?: Option): void;
```

**参数:**

- `app`: Vue 应用实例
- `options`: 可选配置项

**示例:**

```ts
import { install } from '@xiaohaih/create-api';
import { createApp } from 'vue';

const app = createApp(App);
app.use(install, {
    single: true,
    mergeProps: false,
    appendTo: document.body
});
```

### useComponent

通过 JavaScript 方式挂载组件。

```ts
function useComponent<T extends Component>(
    comp: T,
    conf?: Option | ComponentInternalInstance | null,
    ins?: ComponentInternalInstance | null
): UseComponentReturn<T>;
```

**参数:**

- `comp`: 需要挂载的组件
- `conf`: 配置项或 Vue 组件实例
- `ins`: Vue 组件实例

**返回值:** `UseComponentReturn<T>`

**示例:**

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from './Dialog.vue';

const dialogComponent = useComponent(Dialog, {
    single: true,
    appendTo: document.body
});
```

### create

为组件创建 `$create` 方法并挂载到全局属性上。

```ts
function create<T extends Component>(
    component: T,
    conf?: ComponentInternalInstance | Option | null,
    ins?: ComponentInternalInstance
): CreateComponent<T>;
```

**参数:**

- `component`: 需要挂载到全局的组件
- `conf`: Vue 实例或配置项
- `ins`: Vue 实例

**返回值:** `CreateComponent<T>`

**示例:**

```ts
import { create } from '@xiaohaih/create-api';
import Dialog from './Dialog.vue';

create(Dialog);
// 现在可以通过 Dialog.$create() 调用
```

## 类型定义

### Option

配置选项接口。

```ts
interface Option {
    /** 是否作为当前上下文的单例 @default true */
    single?: boolean;
    /** 是否直接取根实例作为上下文 */
    global?: boolean;
    /** 组件重复调用时是否合并上之前的 props */
    mergeProps?: boolean;
    /** 元素挂载的节点 @default document.body */
    appendTo?: string | Element | Node | (() => Element | Node);
}
```

### UseComponentReturn

`useComponent` 函数的返回类型。

```ts
interface UseComponentReturn<T> {
    /** 调用函数，创建或更新组件 */
    (props?: MaybeRefProps<ComponentProps<T>> | null, children?: VNodeChildren): CustomComponent<T>;
    /** 判断是否存在实例 */
    hasInstance: () => boolean;
    /** 获取实例 */
    getInstance: () => CustomComponent<T>;
    /** 更新 props */
    updateProps: (props: MaybeRefProps<ComponentProps<T>> | null, merge?: boolean) => boolean;
    /** 更新插槽 */
    updateSlots: (children: VNodeChildren | null) => boolean;
}
```

### CustomComponent

组件实例的扩展类型。

```ts
type CustomComponent<T> = CustomMethod<T> & Omit<ComponentExposed<T>, keyof CustomMethod<T>>;
```

### CustomMethod

为组件增加的自定义方法。

```ts
interface CustomMethod<T> {
    /** 显示组件 */
    show: (...args: any[]) => CustomComponent<T>;
    /** 隐藏组件 */
    hide: (...args: any[]) => CustomComponent<T>;
    /** 更新 props */
    $updateProps: (props: Record<string, any> | null, mergeProps?: boolean) => CustomComponent<T>;
    /** 更新插槽 */
    $updateSlots: (children?: VNodeChildren | null) => CustomComponent<T>;
    /** 强制更新 */
    $forceUpdate: () => CustomComponent<T>;
    /** 卸载组件 */
    $unmount: () => void;
}
```

## 详细文档

- [install 函数](./install.md) - 全局安装函数的详细说明
- [useComponent 函数](./use-component.md) - 组件挂载函数的详细说明
- [create 函数](./create.md) - 组件创建函数的详细说明
- [类型定义](./types.md) - 完整的类型定义说明
