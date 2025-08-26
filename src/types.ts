import type { App, Component, ComponentInternalInstance, ComponentPublicInstance, MaybeRef, VNode, h } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
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
    /**
     * 组件重复调用时是否合并之前传递的 props(不建议设为 true)
     * 注意: 如果为 true, 会导致传进来的 props 会丢失响应性
     */
    mergeProps?: boolean;
    /** 元素挂载的节点 @default document.body */
    appendTo?: string | Element | Node | (() => Element | Node);
}

export type MaybeRefProps<T> = {
    [K in keyof T]: MaybeRef<T[K]>;
};

/** 补充声明 - 增加挂载到组件实例上的方法 */
export type CustomComponent<T> = CustomMethod<T> & Omit<ComponentExposed<T>, keyof CustomMethod<T>>;

/** 为组件增加自定义事件 */
export type CustomMethod<T, E = ComponentExposed<T>, K extends keyof E = keyof E> = {
    /** 显示时触发 */
    show: (...args: any[]) => CustomComponent<T>;
    /** 隐藏时触发 */
    hide: (...args: any[]) => CustomComponent<T>;
    /**
     * 更新 props(注意: 如果 mergeProps 为真, 传进来的 props 会丢失响应性)
     * @param {Record<string, any> | undefined | null} props 待更新的 props
     * @param {boolean} mergeProps 是否与之前的 props 进行合并
     */
    $updateProps: (props: Record<string, any> | undefined | null, mergeProps?: boolean) => CustomComponent<T>;
    /** 更新 slots */
    $updateSlots: (children?: MaybeRef<VNodeChildren> | null) => CustomComponent<T>;
    /** 强制更新组件 */
    $forceUpdate: () => CustomComponent<T>;
    /** 卸载组件 */
    $unmount: () => void;

// 这种写法可定义注释
// } & Omit<{
//     /** 组件内部的 show 事件 */
//     nativeShow: K extends 'show' ? E[K] : never;
//     /** 组件内部的 hide 事件 */
//     nativeHide: K extends 'hide' ? E[K] : never;
// }, ('show' extends K ? never : 'nativeShow') | ('hide' extends K ? never : 'nativeHide')>;
// 这种写法可跳转到方法定义的位置
} & Required<AdjustReservedKey<T>>;

/** 保留组件内部的 show 和 hide 并调整字段 */
export type AdjustReservedKey<T, E = ComponentExposed<T>, R = 'show' | 'hide'> = {
    [K in keyof E as K extends R ? `native${Capitalize<Extract<K, string>>}` : never]: E[K];
};

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
    // /** 组件当前的 props */
    // [NATIVE_PROPS]: Record<string, any> | undefined | null;
    /** 重写 component 属性, 为 refs 赋值 */
    component: (Omit<NonNullable<VNode['component']>, 'refs'> & {
        refs: { [CHILD_REF]?: CustomComponent<T> };
    } | null);
}

/** 插槽或子组件 */
export type VNodeChildren = NonNullable<Parameters<typeof h>[2]>;

/** 补充全局挂载函数声明 */
export interface CreateFn<T> {
    (props?: (MaybeRefProps<ComponentProps<T>> & { [index: string | number | symbol]: any }) | null, children?: MaybeRef<VNodeChildren>, config?: Option): CustomComponent<T>;
}

/** useComponent 函数的返回函数 */
export interface UseComponentReturn<T> {
    (props?: (MaybeRefProps<ComponentProps<T>> & { [index: string | number | symbol]: any }) | null, children?: MaybeRef<VNodeChildren> | null): CustomComponent<T>;
    /** 判断是否存在实例(是否初始化) */
    hasInstance: () => boolean;
    /** 获取实例(未初始化时, 自动初始化) */
    getInstance: () => CustomComponent<T>;
    /** 更新 props 传参 */
    updateProps: (props: (MaybeRefProps<ComponentProps<T>> & { [index: string | number | symbol]: any }) | undefined | null, merge?: boolean) => boolean;
    /** 更新组件插槽 */
    updateSlots: (children: MaybeRef<VNodeChildren> | undefined | null) => boolean;
}
