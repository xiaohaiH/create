# 高级用法

## 配置选项详解

### single 选项

控制组件是否为单例模式：

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

// 单例模式(默认)
const singleDialog = useComponent(Dialog, { single: true });

// 非单例模式
const multiDialog = useComponent(Dialog, { single: false });

// 单例模式：多次调用会复用同一个实例
singleDialog({ title: '弹窗1' }).show();
singleDialog({ title: '弹窗2' }).show(); // 会更新第一个弹窗

// 非单例模式：每次调用都会创建新实例
multiDialog({ title: '弹窗1' }).show();
multiDialog({ title: '弹窗2' }).show(); // 会创建第二个弹窗
```

### global 选项

控制组件是否挂载到根实例：

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

// 挂载到当前组件实例(默认)
const localDialog = useComponent(Dialog, { global: false });

// 挂载到根实例
const globalDialog = useComponent(Dialog, { global: true });

// 当前组件销毁时，localDialog 会自动销毁
// globalDialog 不会自动销毁，需要手动清理
```

### mergeProps 选项

控制重复调用时是否合并 props：

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

// 不合并 props(默认)
const dialog1 = useComponent(Dialog, { mergeProps: false });
dialog1({ title: '标题1', content: '内容1' }).show();
dialog1({ title: '标题2' }).show(); // 只显示标题2，content 被清空

// 合并 props
const dialog2 = useComponent(Dialog, { mergeProps: true });
dialog2({ title: '标题1', content: '内容1' }).show();
dialog2({ title: '标题2' }).show(); // 显示标题2和内容1
```

### appendTo 选项

控制组件挂载的 DOM 节点：

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from './components/Dialog.vue';

// 挂载到 body(默认)
const bodyDialog = useComponent(Dialog, { appendTo: document.body });

// 挂载到指定元素
const customDialog = useComponent(Dialog, {
    appendTo: '#app-container'
});

// 挂载到函数返回的节点
const dynamicDialog = useComponent(Dialog, {
    appendTo: () => document.querySelector('.dynamic-container')
});

// 挂载到组件内部
const innerDialog = useComponent(Dialog, {
    appendTo: '.dialog-container'
});
```

## 组件设计模式

### 1. 工厂模式

创建可复用的组件工厂：

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from '../components/Dialog.vue';
// utils/dialogFactory.ts

export function createDialogFactory(config?: Option) {
    const dialogComponent = useComponent(Dialog, config);

    return {
    // 成功提示
        success(message: string, title = '成功') {
            return dialogComponent({
                title,
                content: message,
                type: 'success'
            }).show();
        },

        // 错误提示
        error(message: string, title = '错误') {
            return dialogComponent({
                title,
                content: message,
                type: 'error'
            }).show();
        },

        // 确认对话框
        confirm(message: string, title = '确认') {
            return new Promise((resolve) => {
                dialogComponent({
                    title,
                    content: message,
                    onConfirm: () => resolve(true),
                    onCancel: () => resolve(false)
                }).show();
            });
        },

        // 自定义弹窗
        custom(props: any) {
            return dialogComponent(props).show();
        }
    };
}

// 使用
const dialog = createDialogFactory({ single: true });

// 成功提示
dialog.success('操作成功！');

// 确认对话框
const confirmed = await dialog.confirm('确定要删除吗？');
if (confirmed) {
    // 执行删除操作
}
```

### 2. 组合模式

组合多个组件功能：

```ts
import { useComponent } from '@xiaohaih/create-api';
// composables/useDialog.ts
import Dialog from '../components/Dialog.vue';
import Loading from '../components/Loading.vue';
import Toast from '../components/Toast.vue';

export function useDialog() {
    const dialogComponent = useComponent(Dialog, { single: true });
    const loadingComponent = useComponent(Loading, { single: true });
    const toastComponent = useComponent(Toast, { single: false });

    return {
    // 弹窗相关
        dialog: {
            show: (props: any) => dialogComponent(props).show(),
            hide: () => dialogComponent().hide(),
            update: (props: any) => dialogComponent.updateProps(props)
        },

        // 加载相关
        loading: {
            show: (text = '加载中...') => loadingComponent({ text }).show(),
            hide: () => loadingComponent().hide()
        },

        // 提示相关
        toast: {
            success: (message: string) => toastComponent({ message, type: 'success' }).show(),
            error: (message: string) => toastComponent({ message, type: 'error' }).show(),
            info: (message: string) => toastComponent({ message, type: 'info' }).show()
        }
    };
}

// 使用
const { dialog, loading, toast } = useDialog();

// 显示加载
loading.show('正在处理...');

try {
    await someAsyncOperation();
    toast.success('操作成功！');
}
catch (error) {
    toast.error('操作失败！');
}
finally {
    loading.hide();
}
```

### 3. 装饰器模式

为组件添加额外功能：

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from '../components/Dialog.vue';
// utils/withConfirm.ts

export function withConfirm<T extends Component>(
    component: T,
    confirmMessage: string
) {
    const originalComponent = useComponent(component);

    return function (props: any) {
        return new Promise((resolve) => {
            // 先显示确认对话框
            const confirmDialog = useComponent(Dialog, { single: true });
            confirmDialog({
                title: '确认操作',
                content: confirmMessage,
                onConfirm: () => {
                    // 确认后显示原组件
                    const instance = originalComponent(props);
                    instance.show();
                    resolve(instance);
                },
                onCancel: () => {
                    resolve(null);
                }
            }).show();
        });
    };
}

// 使用
const confirmableDialog = withConfirm(Dialog, '确定要执行此操作吗？');

// 会先显示确认对话框，确认后才显示原弹窗
const instance = await confirmableDialog({ title: '操作弹窗' });
```

## 性能优化

### 1. 懒加载组件

```ts
import { useComponent } from '@xiaohaih/create-api';
import { defineAsyncComponent } from 'vue';
// utils/lazyComponent.ts

export function createLazyComponent(loader: () => Promise<any>) {
    const AsyncComponent = defineAsyncComponent(loader);
    return useComponent(AsyncComponent);
}

// 使用
const lazyDialog = createLazyComponent(() => import('./components/HeavyDialog.vue'));

// 只有在调用时才会加载组件
lazyDialog({ title: '懒加载弹窗' }).show();
```

### 2. 组件缓存

```ts
// utils/componentCache.ts
import { useComponent } from '@xiaohaih/create-api';

const componentCache = new Map();

export function getCachedComponent<T extends Component>(
    component: T,
    config?: Option
) {
    const key = `${component.name || 'anonymous'}_${JSON.stringify(config)}`;

    if (!componentCache.has(key)) {
        componentCache.set(key, useComponent(component, config));
    }

    return componentCache.get(key);
}

// 使用
const cachedDialog = getCachedComponent(Dialog, { single: true });
```

### 3. 批量操作

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from '../components/Dialog.vue';
// utils/batchOperation.ts

export function createBatchDialog() {
    const dialogComponent = useComponent(Dialog, { single: true });
    const queue: Array<() => void> = [];
    let isProcessing = false;

    const processQueue = () => {
        if (queue.length === 0) {
            isProcessing = false;
            return;
        }

        isProcessing = true;
        const next = queue.shift()!;
        next();
    };

    return {
        show(props: any) {
            return new Promise((resolve) => {
                const showDialog = () => {
                    const instance = dialogComponent(props);
                    instance.show();

                    // 监听关闭事件
                    const originalHide = instance.hide;
                    instance.hide = (...args: any[]) => {
                        originalHide.apply(instance, args);
                        resolve(instance);
                        processQueue();
                    };
                };

                queue.push(showDialog);

                if (!isProcessing) {
                    processQueue();
                }
            });
        }
    };
}

// 使用
const batchDialog = createBatchDialog();

// 多个弹窗会依次显示
batchDialog.show({ title: '弹窗1' });
batchDialog.show({ title: '弹窗2' });
batchDialog.show({ title: '弹窗3' });
```

## 错误处理

### 1. 全局错误处理

```ts
import { useComponent } from '@xiaohaih/create-api';
import Dialog from '../components/Dialog.vue';
// utils/errorHandler.ts

export function createErrorHandler() {
    const errorDialog = useComponent(Dialog, { single: true });

    return {
        handle(error: Error) {
            console.error('应用错误:', error);

            errorDialog({
                title: '系统错误',
                content: error.message,
                type: 'error',
                onConfirm: () => {
                    // 可以在这里执行错误恢复逻辑
                    window.location.reload();
                }
            }).show();
        },

        // 异步错误处理
        async handleAsync<T>(promise: Promise<T>): Promise<T | null> {
            try {
                return await promise;
            }
            catch (error) {
                this.handle(error as Error);
                return null;
            }
        }
    };
}

// 使用
const errorHandler = createErrorHandler();

// 全局错误处理
window.addEventListener('error', (event) => {
    errorHandler.handle(event.error);
});

// 异步错误处理
const result = await errorHandler.handleAsync(someAsyncOperation());
```

### 2. 组件错误边界

```vue
// components/ErrorBoundary.vue
<template>
    <div v-if="error" class="error-boundary">
        <h3>组件错误</h3>
        <p>{{ error.message }}</p>
        <button @click="retry">
            重试
        </button>
    </div>
    <slot v-else />
</template>

<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';

const error = ref<Error | null>(null);

onErrorCaptured((err) => {
    error.value = err;
    return false; // 阻止错误继续传播
});

function retry() {
    error.value = null;
}
</script>

<script lang="ts">
// 使用
const safeDialog = useComponent(ErrorBoundary, {
    default: () => h(Dialog, { title: '安全弹窗' })
});
</script>
```

## 测试策略

### 1. 单元测试

```ts
// tests/dialog.test.ts
import { useComponent } from '@xiaohaih/create-api';
import { describe, expect, it, vi } from 'vitest';
import Dialog from '../components/Dialog.vue';

describe('Dialog Component', () => {
    it('should show dialog', () => {
        const dialogComponent = useComponent(Dialog);
        const instance = dialogComponent({ title: '测试弹窗' });

        expect(instance).toBeDefined();
        expect(dialogComponent.hasInstance()).toBe(true);
    });

    it('should update props', () => {
        const dialogComponent = useComponent(Dialog);
        dialogComponent({ title: '原始标题' }).show();

        dialogComponent.updateProps({ title: '新标题' });

        // 验证 props 已更新
        expect(dialogComponent.getInstance().title).toBe('新标题');
    });

    it('should handle lifecycle', () => {
        const dialogComponent = useComponent(Dialog);
        const instance = dialogComponent({ title: '测试' }).show();

        instance.hide();
        expect(instance.visible).toBe(false);

        instance.$unmount();
        expect(dialogComponent.hasInstance()).toBe(false);
    });
});
```

### 2. 集成测试

```ts
import { install } from '@xiaohaih/create-api';
// tests/integration.test.ts
import { describe, expect, it } from 'vitest';
import { createApp } from 'vue';
import Dialog from '../components/Dialog.vue';

describe('Integration Tests', () => {
    it('should work with Vue app', () => {
        const app = createApp({});
        app.use(install);

        const dialogComponent = useComponent(Dialog);
        const instance = dialogComponent({ title: '集成测试' }).show();

        expect(instance).toBeDefined();
    });
});
```

## 最佳实践总结

1. **合理使用配置选项**: 根据实际需求选择合适的配置
2. **组件设计**: 确保组件具有良好的接口设计
3. **性能优化**: 使用懒加载、缓存等技术优化性能
4. **错误处理**: 建立完善的错误处理机制
5. **测试覆盖**: 编写全面的测试用例
6. **类型安全**: 充分利用 TypeScript 的类型系统
7. **文档维护**: 保持文档的及时更新
