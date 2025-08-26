# useComponent 函数

通过 JavaScript 方式挂载组件，返回一个可调用的函数和相关的管理方法。

## 函数签名

```ts
function useComponent<T extends Component>(
    comp: T,
    conf?: Option | ComponentInternalInstance | null,
    ins?: ComponentInternalInstance | null
): UseComponentReturn<T>;
```

## 参数

| 参数   | 类型                                          | 必需 | 描述                  |
| ------ | --------------------------------------------- | ---- | --------------------- |
| `comp` | `T extends Component`                         | 是   | 需要挂载的组件        |
| `conf` | `Option \| ComponentInternalInstance \| null` | 否   | 配置项或 Vue 组件实例 |
| `ins`  | `ComponentInternalInstance \| null`           | 否   | 挂载时绑定到的实例    |

## 返回值

`UseComponentReturn<T>` - 返回一个函数和相关的管理方法

## 返回值类型

### UseComponentReturn 接口

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

## 使用示例

### 基础用法

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

const dialogComponent = useComponent(Dialog);

// 显示弹窗
dialogComponent({
    title: '提示',
    content: '这是一个弹窗'
}).show();

// 隐藏弹窗
dialogComponent().hide();

// 卸载弹窗
dialogComponent().$unmount();
```

### 带配置的用法

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

const dialogComponent = useComponent(Dialog, {
    single: true, // 单例模式
    global: false, // 不挂载到根实例
    mergeProps: false, // 不合并 props
    appendTo: document.body // 挂载到 body
});

dialogComponent({
    title: '配置弹窗',
    content: '这是一个带配置的弹窗'
}).show();
```

### 实例绑定

```ts
import { getCurrentInstance, useComponent } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

const instance = getCurrentInstance();
const dialogComponent = useComponent(Dialog, instance);

// 组件会绑定到当前实例
dialogComponent({
    title: '实例弹窗'
}).show();
```

## 返回函数的方法

### 主函数

返回的函数可以直接调用，用于创建或更新组件：

```ts
const dialogComponent = useComponent(Dialog);

// 创建并显示组件
const instance = dialogComponent({
    title: '弹窗标题',
    content: '弹窗内容'
});

// 显示组件
instance.show();

// 隐藏组件
instance.hide();
```

### hasInstance

检查组件实例是否存在：

```ts
const dialogComponent = useComponent(Dialog);

if (dialogComponent.hasInstance()) {
    console.log('弹窗已存在');
}
else {
    console.log('弹窗不存在');
}
```

### getInstance

获取组件实例，如果不存在会自动创建：

```ts
const dialogComponent = useComponent(Dialog);

// 获取实例(如果不存在会创建)
const instance = dialogComponent.getInstance();

// 现在可以调用实例方法
instance.show();
```

### updateProps

更新组件的 props：

```ts
const dialogComponent = useComponent(Dialog);

// 显示弹窗
dialogComponent({ title: '原始标题' }).show();

// 更新标题
dialogComponent.updateProps({ title: '新标题' });

// 合并更新
dialogComponent.updateProps({ content: '新内容' }, true);
```

### updateSlots

更新组件的插槽：

```ts
import { h } from 'vue';

const dialogComponent = useComponent(Dialog);

// 显示弹窗
dialogComponent({ title: '弹窗' }).show();

// 更新插槽内容
dialogComponent.updateSlots({
    default: () => h('div', '新的插槽内容')
});
```

## 组件实例方法

通过 `useComponent` 创建的组件实例具有以下额外方法：

### show

显示组件：

```ts
const instance = dialogComponent({ title: '弹窗' });
instance.show(); // 显示组件
```

### hide

隐藏组件：

```ts
const instance = dialogComponent({ title: '弹窗' });
instance.hide(); // 隐藏组件
```

### $updateProps

更新组件的 props：

```ts
const instance = dialogComponent({ title: '弹窗' });
instance.$updateProps({ title: '新标题' });
```

### $updateSlots

更新组件的插槽：

```ts
const instance = dialogComponent({ title: '弹窗' });
instance.$updateSlots({ default: () => h('div', '新内容') });
```

### $forceUpdate

强制更新组件：

```ts
const instance = dialogComponent({ title: '弹窗' });
instance.$forceUpdate();
```

### $unmount

卸载组件：

```ts
const instance = dialogComponent({ title: '弹窗' });
instance.$unmount(); // 完全卸载组件
```

## 配置选项

### Option 接口

```ts
interface Option {
    /** 是否作为当前上下文中的单例 @default true */
    single?: boolean;
    /** 是否直接取根实例作为上下文 */
    global?: boolean;
    /** 组件重复调用时是否合并上之前的 props */
    mergeProps?: boolean;
    /** 元素挂载的节点 @default document.body */
    appendTo?: string | Element | Node | (() => Element | Node);
}
```

## 最佳实践

1. **单例模式**: 对于弹窗等组件，建议使用 `single: true`
2. **内存管理**: 及时调用 `$unmount()` 清理不需要的组件
3. **响应式**: 使用 `ref` 或 `reactive` 创建响应式的 props
4. **错误处理**: 在调用方法前检查实例是否存在
5. **类型安全**: 使用 TypeScript 获得更好的类型提示

## 注意事项

1. **组件设计**: 确保组件内部实现 `show` 和 `hide` 方法
2. **生命周期**: 组件会随父组件销毁而自动销毁(除非使用 `global: true`)
3. **性能考虑**: 合理使用 `single` 选项避免重复创建组件
4. **DOM 挂载**: 组件会挂载到指定的 DOM 节点上
