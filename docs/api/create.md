# create 函数

为组件创建 `$create` 方法并挂载到全局属性上。

## 函数签名

```ts
function create<T extends Component>(
    component: T,
    conf?: ComponentInternalInstance | Option | null,
    ins?: ComponentInternalInstance
): CreateComponent<T>;
```

## 参数

| 参数        | 类型                                          | 必需 | 描述                 |
| ----------- | --------------------------------------------- | ---- | -------------------- |
| `component` | `T extends Component`                         | 是   | 需要挂载到全局的组件 |
| `conf`      | `ComponentInternalInstance \| Option \| null` | 否   | Vue 实例或配置项     |
| `ins`       | `ComponentInternalInstance`                   | 否   | Vue 实例             |

## 返回值

`CreateComponent<T>` - 返回带有 `$create` 方法的组件

## 返回值类型

### CreateComponent 接口

```ts
type CreateComponent<T> = T & {
    $create: () => CustomComponent<T>;
};
```

## 使用示例

### 基础用法

```ts
import { create } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

// 注册组件
create(Dialog);

// 现在可以通过组件本身调用
Dialog.$create({
    title: '全局弹窗',
    content: '这是一个全局调用的弹窗'
}).show();
```

### 带配置的用法

```ts
import { create } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

// 带配置注册
create(Dialog, {
    single: true,
    mergeProps: false,
    appendTo: document.body
});

// 使用配置创建弹窗
Dialog.$create({
    title: '配置弹窗',
    content: '这是一个带配置的弹窗'
}).show();
```

### 在组件实例中注册

```ts
import { create, getCurrentInstance } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

// 在组件中注册
const instance = getCurrentInstance();
create(Dialog, instance);

// 通过实例调用
instance?.proxy?.$createDialog({
    title: '实例弹窗',
    content: '通过实例调用的弹窗'
}).show();
```

## 全局方法生成

当组件通过 `create` 函数注册后，会在全局生成以下方法：

### $create 方法

组件本身的 `$create` 方法：

```ts
// 直接调用组件的方法
Dialog.$create(props, children, config);
```

### 全局方法

在 Vue 实例上生成 `$create组件名` 方法：

```ts
// 假设组件名为 Dialog
getCurrentInstance()?.proxy?.$createDialog(props, children, config);
```

## 组件命名要求

为了生成全局方法，组件需要设置 `name` 属性：

```vue
<script>
export default {
    name: 'DialogCustom', // 必须设置组件名称
    // ... 其他配置
};
</script>
```

或者使用 `<script setup>` 语法：

```vue
<script setup lang="ts">
// 设置组件名称
defineOptions({
    name: 'DialogCustom'
});
</script>
```

## 类型声明

为了获得完整的类型支持，需要添加类型声明：

```ts
import type Dialog from '@/components/dialog.vue';
// src/types/create.d.ts
import type { CreateFn } from '@xiaohaih/create-api';

declare module 'vue' {
    interface ComponentCustomProperties {
        $createDialog: CreateFn<typeof Dialog>;
    }
}
```

## 完整示例

### 1. 组件定义

```vue
<!-- components/Dialog.vue -->
<template>
    <Teleport to="body">
        <div v-if="visible" class="dialog-overlay">
            <div class="dialog-content">
                <h3>{{ title }}</h3>
                <p>{{ content }}</p>
                <button @click="hide">
                    关闭
                </button>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 设置组件名称
defineOptions({
    name: 'DialogCustom'
});

const props = withDefaults(defineProps<Props>(), {
    title: '提示',
    content: ''
});

interface Props {
    title?: string;
    content?: string;
}

const visible = ref(false);

function show() {
    visible.value = true;
}

function hide() {
    visible.value = false;
}

defineExpose({
    show,
    hide
});
</script>
```

### 2. 注册组件

```ts
import { install } from '@xiaohaih/create-api';
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(install);
app.mount('#app');
```

```ts
import { create } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';
// 在组件中注册

create(Dialog);
```

### 3. 使用组件

```ts
// 方式1：直接调用组件方法
Dialog.$create({
    title: '直接调用',
    content: '通过组件本身调用'
}).show();

// 方式2：通过实例调用
getCurrentInstance()?.proxy?.$createDialog({
    title: '实例调用',
    content: '通过实例调用'
}).show();

// 方式3：在模板中使用
// 需要在 setup 中注册
const instance = getCurrentInstance();
instance?.proxy?.$createDialog({
    title: '模板调用',
    content: '在模板中调用'
}).show();
```

## 注意事项

1. **组件名称**: 必须设置组件名称才能生成全局方法
2. **类型声明**: 需要手动添加类型声明以获得完整的类型支持
3. **生命周期**: 全局注册的组件不会随组件销毁而自动销毁
4. **内存管理**: 需要手动清理不需要的组件实例
5. **配置优先级**: 全局配置会被组件级别的配置覆盖

## 最佳实践

1. **命名规范**: 使用 PascalCase 命名组件
2. **类型安全**: 添加完整的类型声明
3. **错误处理**: 在调用前检查组件是否已注册
4. **性能考虑**: 合理使用单例模式
5. **文档维护**: 及时更新组件文档
