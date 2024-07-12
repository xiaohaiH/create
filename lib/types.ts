import type { App, Component, ComponentInternalInstance, ComponentPublicInstance, VNode, h } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import type { CHILD_REF, CONFIG_KEY, CONTAINER, INSTALLED_KEY, NATIVE_PROPS } from './config';

/** 为 App 实例补充声明 */
export type CustomApp<T extends App> = T & {
    [INSTALLED_KEY]?: boolean;
};

/** 可选配置项 */
export interface Option {
    /** 是否作为当前上下文的单例 @default true */
    single?: boolean;
    /** 是否直接取根实例作为上下文(无法被动销毁组件, 只能手动销毁) */
    global?: boolean;
    /** 组件重复调用时是否合并上之前的 props */
    mergeProps?: boolean;
    /** 元素挂载的节点 @default document.body */
    appendTo?: string | Element | Node | (() => Element | Node);
}

/** 补充声明 - 增加挂载到组件实例上的方法 */
export type CustomComponent<T> = CustomMethod<T> & Omit<ComponentExposed<T>, keyof CustomMethod<T>>;

/** 为组件增加自定义事件 */
export interface CustomMethod<T> {
    /** 组件内部的 show 事件 */
    nativeShow?: (...args: any[]) => void;
    /** 组件内部的 hide 事件 */
    nativeHide?: (...args: any[]) => void;
    /** 显示时触发 */
    show: (...args: any[]) => CustomComponent<T>;
    /** 隐藏时触发 */
    hide: (...args: any[]) => CustomComponent<T>;
    /** 更新 props */
    $updateProps: (props: Record<string, any>, mergeProps?: boolean) => CustomComponent<T>;
    /** 卸载组件 */
    $unmount: () => void;
}

/** 为 vue 组件补充 $create 方法 */
export type CreateComponent<T> = T & {
    $create: () => CustomComponent<T>;
};

/** 为 VNode 补充声明 */
export interface CustomVNode<T> extends Omit<VNode, 'component'> {
    /** 将组件实例绑定到指定属性上 */
    [CHILD_REF]: CustomComponent<T>;
    /** 挂载元素 */
    [CONTAINER]: HTMLElement | null;
    /** 组件当前的 props */
    [NATIVE_PROPS]: Record<string, any> | undefined | null;
    /** 重写 component 属性, 为 refs 赋值 */
    component: (Omit<NonNullable<VNode['component']>, 'refs'> & {
        refs: { [CHILD_REF]?: CustomComponent<T> };
    } | null);
}

/** 插槽或子组件 */
export type VNodeChildren = NonNullable<Parameters<typeof h>[2]>;
