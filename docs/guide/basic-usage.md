# 基础用法

## 函数式调用

### 基本用法

使用 `useComponent` 函数直接调用组件：

```vue
<template>
    <button @click="showDialog">
        显示弹窗
    </button>
</template>

<script setup lang="ts">
import { useComponent } from '@xiaohaih/create-api';
import Dialog from './components/dialog.vue';

const dialogComponent = useComponent(Dialog);

function showDialog() {
    dialogComponent({
        title: '提示',
        content: '这是一个弹窗'
    }).show();
}
</script>
```

### 带配置的用法

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from './components/dialog.vue';

// 配置选项
const dialogComponent = useComponent(Dialog, {
    single: true, // 单例模式
    mergeProps: false, // 不合并 props
    appendTo: document.body // 挂载到 body
});

function showDialog() {
    dialogComponent({
        title: '配置弹窗',
        content: '这是一个带配置的弹窗'
    }).show();
}
```

## 全局挂载

### 1. 安装插件

```ts
import { install } from '@xiaohaih/create-api';
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(install);
app.mount('#app');
```

### 2. 注册组件

```ts
import { create } from '@xiaohaih/create-api';
import Dialog from './components/dialog.vue';
// 在组件中注册

// 注册组件
create(Dialog);
```

### 3. 全局调用

```ts
// 在任意地方调用
Dialog.$create({
    title: '全局弹窗',
    content: '这是一个全局调用的弹窗'
}).show();

// 或者在 Vue 组件中通过实例调用
getCurrentInstance()?.proxy?.$createDialog({
    title: '实例弹窗',
    content: '通过实例调用的弹窗'
}).show();
```

## 组件生命周期管理

### 显示和隐藏

```ts
const dialogComponent = useComponent(Dialog);

// 显示组件(需要组件内部实现 show 方法)
dialogComponent({ title: '弹窗' }).show();

// 隐藏组件(需要组件内部实现 hide 方法)
dialogComponent().hide();

// 卸载组件
dialogComponent().$unmount();
```

### 检查实例状态

```ts
const dialogComponent = useComponent(Dialog);

// 检查是否有实例
if (dialogComponent.hasInstance()) {
    console.log('弹窗已存在');
}

// 获取实例(如果不存在会自动创建)
const instance = dialogComponent.getInstance();
```

## 动态更新

### 更新 Props

```ts
const dialogComponent = useComponent(Dialog);

// 显示弹窗
dialogComponent({ title: '原始标题' }).show();

// 更新标题
dialogComponent.updateProps({ title: '新标题' });

// 合并更新
dialogComponent.updateProps({ content: '新内容' }, true);
```

### 更新插槽

```ts
const dialogComponent = useComponent(Dialog);

// 显示弹窗
dialogComponent({ title: '弹窗' }).show();

// 更新插槽内容
dialogComponent.updateSlots({
    default: () => h('div', '新的插槽内容')
});
```

## 响应式支持

### 响应式 Props

```ts
import { reactive, ref } from 'vue';

const title = ref('响应式标题');
const props = reactive({
    content: '响应式内容',
    visible: true
});

const dialogComponent = useComponent(Dialog);

// 使用响应式数据
dialogComponent({ title, ...props }).show();

// 修改响应式数据会自动更新组件
title.value = '新的标题';
props.content = '新的内容';
```

## 完整示例

```vue
<template>
    <div>
        <button @click="showDialog">
            显示弹窗
        </button>
        <button @click="updateDialog">
            更新弹窗
        </button>
        <button @click="hideDialog">
            隐藏弹窗
        </button>
        <button @click="destroyDialog">
            销毁弹窗
        </button>
    </div>
</template>

<script setup lang="ts">
import { useComponent } from '@xiaohaih/create-api';
import { ref } from 'vue';
import Dialog from './components/dialog.vue';

const dialogComponent = useComponent(Dialog);
const dialogVisible = ref(false);

function showDialog() {
    dialogVisible.value = true;
    dialogComponent({
        title: '示例弹窗',
        content: '这是一个完整的示例',
        onClose: () => {
            dialogVisible.value = false;
        }
    }).show();
}

function updateDialog() {
    if (dialogComponent.hasInstance()) {
        dialogComponent.updateProps({
            title: '更新后的标题',
            content: '更新后的内容'
        });
    }
}

function hideDialog() {
    if (dialogComponent.hasInstance()) {
        dialogComponent().hide();
    }
}

function destroyDialog() {
    if (dialogComponent.hasInstance()) {
        dialogComponent().$unmount();
        dialogVisible.value = false;
    }
}
</script>
```

## 最佳实践

1. **组件设计**: 确保组件内部实现 `show` 和 `hide` 方法
2. **类型安全**: 使用 TypeScript 获得更好的类型提示
3. **生命周期**: 及时清理不需要的组件实例
4. **响应式**: 优先使用响应式数据传递 props
5. **错误处理**: 在调用前检查组件实例是否存在
