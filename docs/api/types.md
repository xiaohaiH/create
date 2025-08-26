# 类型定义

vue-create-api 提供了完整的 TypeScript 类型支持，帮助您在使用时获得更好的开发体验。

## 核心类型

### Option

配置选项接口，用于控制组件的行为。

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

**属性说明:**

| 属性         | 类型                                                   | 默认值          | 描述                                          |
| ------------ | ------------------------------------------------------ | --------------- | --------------------------------------------- |
| `single`     | `boolean`                                              | `true`          | 是否作为当前上下文中的单例                    |
| `global`     | `boolean`                                              | `false`         | 是否将组件挂载到根实例上                      |
| `mergeProps` | `boolean`                                              | `false`         | 重复调用时是否与上次调用时传的 props 进行合并 |
| `appendTo`   | `string \| Element \| Node \| (() => Element \| Node)` | `document.body` | 挂载到的节点                                  |

### MaybeRefProps

支持响应式的 props 类型。

```ts
type MaybeRefProps<T> = {
    [K in keyof T]: MaybeRef<T[K]>
};
```

这个类型将对象的所有属性都包装为 `MaybeRef`，支持传递 `ref` 或 `reactive` 数据。

### CustomComponent

组件实例的扩展类型，包含额外的管理方法。

```ts
type CustomComponent<T> = CustomMethod<T> & Omit<ComponentExposed<T>, keyof CustomMethod<T>>;
```

### CustomMethod

为组件增加的自定义方法类型。

```ts
type CustomMethod<T> = {
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
} & Required<AdjustReservedKey<T>>;
```

### AdjustReservedKey

保留组件内部的 `show` 和 `hide` 方法并调整字段名。

```ts
type AdjustReservedKey<T, E = ComponentExposed<T>, R = 'show' | 'hide'> = {
    [K in keyof E as K extends R ? `native${Capitalize<Extract<K, string>>}` : never]: E[K]
};
```

这个类型会将组件内部的 `show` 和 `hide` 方法重命名为 `nativeShow` 和 `nativeHide`。

### CreateComponent

为 Vue 组件补充 `$create` 方法的类型。

```ts
type CreateComponent<T> = T & {
    $create: () => CustomComponent<T>;
};
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

### CustomVNode

为 VNode 补充声明的类型。

```ts
interface CustomVNode<T> extends Omit<VNode, 'component'> {
    /** 将组件实例绑定到指定属性上 */
    [CHILD_REF]: CustomComponent<T>;
    /** 挂载元素 */
    [CONTAINER]: HTMLElement | null;
    /** 重写 component 属性, 为 refs 赋值 */
    component: (Omit<NonNullable<VNode['component']>, 'refs'> & {
        refs: { [CHILD_REF]?: CustomComponent<T> };
    } | null);
}
```

### CreateFn

补充全局挂载函数声明的类型。

```ts
interface CreateFn<T> {
    (props?: (MaybeRefProps<ComponentProps<T>> & { [index: string | number | symbol]: any }) | null, children?: VNodeChildren, config?: Option): CustomComponent<T>;
}
```

### CustomApp

为 App 实例补充声明的类型。

```ts
type CustomApp<T extends App> = T & {
    [INSTALLED_KEY]?: boolean;
};
```

## 常量定义

### 内部常量

```ts
/** 判断是否在该实例是否安装过的 key */
export const INSTALLED_KEY = Symbol('install-key');

/** 挂载到全局配置项的 key */
export const CONFIG_KEY = Symbol('create-config');

/** 子组件的 ref 引用 */
export const CHILD_REF = '_instance';

/** 挂载元素 */
export const CONTAINER = '_container';

/** 组件当前传递的参数 */
export const NATIVE_PROPS = '_nativeProps';
```

## 类型使用示例

### 1. 基础组件类型

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

// 自动推断类型
const dialogComponent = useComponent(Dialog);

// 明确指定类型
const typedDialogComponent: UseComponentReturn<typeof Dialog> = useComponent(Dialog);
```

### 2. 自定义组件类型

```ts
interface DialogProps {
    title: string;
    content?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface DialogExposed {
    show: () => void;
    hide: () => void;
    visible: boolean;
}

// 自定义组件类型
const CustomDialog = defineComponent<DialogProps, {}, DialogExposed>({
    name: 'CustomDialog',
    props: {
        title: { type: String, required: true },
        content: String,
        onConfirm: Function,
        onCancel: Function
    },
    setup(props, { expose }) {
        const visible = ref(false);

        function show() {
            visible.value = true;
        };
        function hide() {
            visible.value = false;
        };

        expose({ show, hide, visible });

        return { visible };
    }
});

// 使用自定义组件
const dialogComponent = useComponent(CustomDialog);
```

### 3. 响应式 Props

```ts
import { useComponent } from '@xiaohaih/create-api';
import { reactive, ref } from 'vue';
import Dialog from './components/Dialog.vue';

const dialogComponent = useComponent(Dialog);

// 使用 ref
const title = ref('响应式标题');
const content = ref('响应式内容');

dialogComponent({ title, content }).show();

// 使用 reactive
const props = reactive({
    title: '响应式标题',
    content: '响应式内容'
});

dialogComponent(props).show();
```

### 4. 全局类型声明

```ts
import type Dialog from '@/components/dialog.vue';
import type Toast from '@/components/toast.vue';
// src/types/create.d.ts
import type { CreateFn } from '@xiaohaih/create-api';

declare module 'vue' {
    interface ComponentCustomProperties {
        $createDialog: CreateFn<typeof Dialog>;
        $createToast: CreateFn<typeof Toast>;
    }
}
```

### 5. 泛型约束

```ts
// 创建泛型组件工厂
function createComponentFactory<T extends Component>(
    component: T,
    defaultConfig?: Option
) {
    return useComponent(component, defaultConfig);
}

// 使用
const dialogFactory = createComponentFactory(Dialog, { single: true });
const toastFactory = createComponentFactory(Toast, { single: false });
```

## 类型工具函数

### 类型守卫

```ts
// 判断是否是实例
function isInstance(val: any): val is ComponentInternalInstance {
    return val && typeof val === 'object' && 'uid' in val;
}

// 使用
const config = someValue;
if (isInstance(config)) {
    // config 是 ComponentInternalInstance 类型
}
else {
    // config 是 Option 类型
}
```

### 类型转换

```ts
// 将组件转换为 CreateComponent 类型
function toCreateComponent<T extends Component>(component: T): CreateComponent<T> {
    return component as CreateComponent<T>;
}

// 使用
const dialog = toCreateComponent(Dialog);
dialog.$create({ title: '测试' }).show();
```

## 最佳实践

### 1. 类型安全

```ts
// 使用明确的类型声明
interface MyDialogProps {
    title: string;
    content: string;
    onConfirm: () => void;
}

const MyDialog = defineComponent<MyDialogProps>({
    // 组件定义
});

const dialogComponent = useComponent(MyDialog);

// 现在会有完整的类型提示
dialogComponent({
    title: '标题', // 类型提示
    content: '内容', // 类型提示
    onConfirm: () => {} // 类型提示
}).show();
```

### 2. 类型扩展

```ts
// 扩展组件类型
interface ExtendedDialogProps extends DialogProps {
    theme?: 'light' | 'dark';
    size?: 'small' | 'medium' | 'large';
}

const ExtendedDialog = defineComponent<ExtendedDialogProps>({
    // 扩展的组件定义
});
```

### 3. 类型推断

```ts
// 利用 TypeScript 的类型推断
function createDialog<T extends Component>(component: T) {
    return useComponent(component);
}

// 自动推断类型
const dialog = createDialog(Dialog);
// dialog 的类型是 UseComponentReturn<typeof Dialog>
```

## 常见问题

### Q: 如何解决类型错误？

A: 确保正确导入类型，并检查组件是否正确定义了 props 和 expose 的方法。

### Q: 如何扩展组件类型？

A: 使用 `defineComponent` 的泛型参数，或者创建接口继承现有的类型。

### Q: 如何处理动态组件？

A: 使用 `Component` 类型，或者创建联合类型来处理多个组件。

### Q: 如何获得更好的类型提示？

A: 使用明确的类型声明，避免使用 `any` 类型，并充分利用 TypeScript 的类型推断功能。
