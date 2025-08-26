# 基础弹窗示例

## 组件定义

首先创建一个基础的弹窗组件：

````vue
<!-- components/Dialog.vue -->
<template>
    <Teleport to="body">
        <div v-if="visible" class="dialog-overlay" @click="handleOverlayClick">
            <div class="dialog-content" @click.stop>
                <div class="dialog-header">
                    <h3>{{ title }}</h3>
                    <button class="close-btn" @click="handleClose">
                        ×
                    </button>
                </div>
                <div class="dialog-body">
                    <slot>{{ content }}</slot>
                </div>
                <div class="dialog-footer">
                    <button @click="handleCancel">
                        取消
                    </button>
                    <button class="primary" @click="handleConfirm">
                        确定
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<template>
  <div>
    <button @click="showBasicDialog">显示基础弹窗</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
</script>

## 使用示例

### 1. 基础用法

```vue
<script setup lang="ts">
import { useComponent } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

interface Props {
    title?: string;
    content?: string;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
    title: '提示',
    content: ''
});

const visible = ref(false);

// 显示方法
function show() {
    visible.value = true;
}

// 隐藏方法
function hide() {
    visible.value = false;
}

// 暴露方法给外部调用
defineExpose({
    show,
    hide
});

function handleClose() {
    hide();
    props.onClose?.();
}

function handleConfirm() {
    hide();
    props.onConfirm?.();
}

function handleCancel() {
    hide();
    props.onCancel?.();
}

function handleOverlayClick() {
    handleClose();
}

const dialogComponent = useComponent(Dialog);

function showBasicDialog() {
    dialogComponent({
        title: '基础弹窗',
        content: '这是一个基础弹窗示例',
        onConfirm: () => {
            console.log('用户点击了确定');
        },
        onCancel: () => {
            console.log('用户点击了取消');
        }
    }).show();
}
</script>

<style scoped>
.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.dialog-content {
    background: white;
    border-radius: 8px;
    min-width: 400px;
    max-width: 80%;
    max-height: 80%;
    overflow: hidden;
}

.dialog-header {
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dialog-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
}

.close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #999;
}

.close-btn:hover {
    color: #333;
}

.dialog-body {
    padding: 20px;
    min-height: 60px;
}

.dialog-footer {
    padding: 16px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.dialog-footer button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
}

.dialog-footer button.primary {
    background: #1890ff;
    color: white;
    border-color: #1890ff;
}

.dialog-footer button:hover {
    opacity: 0.8;
}
</style>
````

### 2. 带插槽的用法

```vue
<template>
    <div>
        <button @click="showCustomDialog">
            显示自定义弹窗
        </button>
    </div>
</template>

<script setup lang="ts">
import { useComponent } from '@xiaohaih/create-api';
import { h } from 'vue';
import Dialog from './components/Dialog.vue';

const dialogComponent = useComponent(Dialog);

function showCustomDialog() {
    dialogComponent({
        title: '自定义弹窗',
        onConfirm: () => {
            console.log('确认操作');
        }
    }, {
        default: () => h('div', [
            h('p', '这是自定义的弹窗内容'),
            h('p', '支持任意 Vue 组件和 HTML 元素'),
            h('input', {
                type: 'text',
                placeholder: '请输入内容',
                style: 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;'
            })
        ])
    }).show();
}
</script>
```

### 3. 动态更新

```vue
<template>
    <div>
        <button @click="showDynamicDialog">
            显示动态弹窗
        </button>
        <button :disabled="!dialogVisible" @click="updateDialog">
            更新弹窗
        </button>
        <button :disabled="!dialogVisible" @click="hideDialog">
            隐藏弹窗
        </button>
    </div>
</template>

<script setup lang="ts">
import { useComponent } from '@xiaohaih/create-api';
import { ref } from 'vue';
import Dialog from './components/Dialog.vue';

const dialogComponent = useComponent(Dialog);
const dialogVisible = ref(false);

function showDynamicDialog() {
    dialogVisible.value = true;
    dialogComponent({
        title: '动态弹窗',
        content: '初始内容',
        onClose: () => {
            dialogVisible.value = false;
        }
    }).show();
}

function updateDialog() {
    dialogComponent.updateProps({
        title: '更新后的标题',
        content: '更新后的内容'
    });
}

function hideDialog() {
    dialogComponent().hide();
    dialogVisible.value = false;
}
</script>
```

### 4. 响应式数据

```vue
<template>
    <div>
        <button @click="showReactiveDialog">
            显示响应式弹窗
        </button>
        <button @click="updateReactiveData">
            更新响应式数据
        </button>
    </div>
</template>

<script setup lang="ts">
import { useComponent } from '@xiaohaih/create-api';
import { reactive, ref } from 'vue';
import Dialog from './components/Dialog.vue';

const dialogComponent = useComponent(Dialog);
const dialogComponent2 = useComponent(Dialog);

const title = ref({ title: '响应式标题' });
const dialogData = reactive({
    content: '响应式内容',
    visible: true
});

function showReactiveDialog() {
    dialogComponent(title).show();
}
function showReactiveDialog2() {
    dialogComponent2(dialogData).show();
}

function updateReactiveData() {
    title.value.title = '新的响应式标题';
    dialogData.content = '新的响应式内容';
}
</script>
```

## 完整示例

```vue
<template>
    <div class="demo-container">
        <h2>弹窗示例</h2>

        <div class="button-group">
            <button @click="showBasicDialog">
                基础弹窗
            </button>
            <button @click="showCustomDialog">
                自定义弹窗
            </button>
            <button @click="showDynamicDialog">
                动态弹窗
            </button>
            <button @click="showReactiveDialog">
                响应式弹窗
            </button>
        </div>

        <div v-show="dialogVisible" class="control-group">
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

        <div class="status">
            <p>弹窗状态: {{ dialogVisible ? '显示中' : '已隐藏' }}</p>
            <p>实例存在: {{ dialogComponent.hasInstance() ? '是' : '否' }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useComponent } from '@xiaohaih/create-api';
import { h, reactive, ref } from 'vue';
import Dialog from './components/Dialog.vue';

const dialogComponent = useComponent(Dialog);
const dialogVisible = ref(false);

// 响应式数据
const title = ref('响应式标题');
const dialogData = reactive({
    content: '响应式内容'
});

function showBasicDialog() {
    dialogVisible.value = true;
    dialogComponent({
        title: '基础弹窗',
        content: '这是一个基础弹窗示例',
        onConfirm: () => {
            console.log('确认操作');
            dialogVisible.value = false;
        },
        onCancel: () => {
            console.log('取消操作');
            dialogVisible.value = false;
        },
        onClose: () => {
            dialogVisible.value = false;
        }
    }).show();
}

function showCustomDialog() {
    dialogVisible.value = true;
    dialogComponent({
        title: '自定义弹窗',
        onClose: () => {
            dialogVisible.value = false;
        }
    }, {
        default: () => h('div', [
            h('p', '这是自定义的弹窗内容'),
            h('p', '支持任意 Vue 组件和 HTML 元素'),
            h('input', {
                type: 'text',
                placeholder: '请输入内容',
                style: 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-top: 8px;'
            })
        ])
    }).show();
}

function showDynamicDialog() {
    dialogVisible.value = true;
    dialogComponent({
        title: '动态弹窗',
        content: '初始内容',
        onClose: () => {
            dialogVisible.value = false;
        }
    }).show();
}

function showReactiveDialog() {
    dialogVisible.value = true;
    dialogComponent({
        title,
        ...dialogData,
        onClose: () => {
            dialogVisible.value = false;
        }
    }).show();
}

function updateDialog() {
    dialogComponent.updateProps({
        title: '更新后的标题',
        content: '更新后的内容'
    });
}

function hideDialog() {
    dialogComponent().hide();
    dialogVisible.value = false;
}

function destroyDialog() {
    dialogComponent().$unmount();
    dialogVisible.value = false;
}
</script>

<style scoped>
.demo-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.button-group {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.control-group {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 14px;
}

button:hover {
    background: #f5f5f5;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.status {
    background: #f5f5f5;
    padding: 16px;
    border-radius: 4px;
}

.status p {
    margin: 4px 0;
    font-size: 14px;
}
</style>

## 关键要点

1. **组件设计**: 确保组件内部实现 `show` 和 `hide` 方法
2. **Teleport**: 使用 `Teleport` 将弹窗挂载到 `body` 上
3. **事件处理**: 正确处理点击遮罩层关闭等交互
4. **响应式**: 使用响应式数据实现动态更新
5. **生命周期**: 及时清理组件实例避免内存泄漏
```
