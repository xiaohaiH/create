import type { App, Component, ComponentInternalInstance, ComponentPublicInstance, VNode } from 'vue';
import { camelize, getCurrentInstance, h, isVNode, mergeProps, nextTick, onBeforeUnmount, reactive, render } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import { CHILD_REF, CONFIG_KEY, CONTAINER, INSTALLED_KEY, NATIVE_PROPS } from './config';
import type { CreateComponent, CustomApp, CustomComponent, CustomVNode, MaybeRefProps, Option, UseComponentReturn, VNodeChildren } from './types';

/** 最新挂载的全局实例 */
let globalInstance: CustomApp<App> | null;

/** 默认配置 */
const DEFAULT_OPTION = {
    single: true,
    mergeProps: false,
    appendTo: document.body,
} satisfies Option;

/** 全局安装函数 */
export function install<T extends App>(app: T, options?: Option) {
    if ((app as CustomApp<T>)[INSTALLED_KEY]) return;
    (app as CustomApp<T>)[INSTALLED_KEY] = true;
    globalInstance = app;
    options && (app.config.globalProperties[CONFIG_KEY] = options);
    app.config.globalProperties.$create = create;
}

/**
 * 为组件创建 $create 函数并挂载到全局属性上(挂载到全局时组件名称需定义)
 * @param {CreateComponent} component 需要挂载到全局或需要增加 $create 方法的组件
 * @param {ComponentInternalInstance | Option} [conf] vue 实例或者配置项(配置项未传时取全局配置或默认配置)
 * @param {ComponentInternalInstance} [ins] vue 实例
 */
export function create<T extends Component>(component: T, conf?: ComponentInternalInstance | Option | null, ins?: ComponentInternalInstance): CreateComponent<T> {
    const config = isInstance(conf) ? undefined : conf;
    const instance = (isInstance(conf) ? conf : ins) || globalInstance?._instance;
    (component as CreateComponent<T>).$create = (props?: MaybeRefProps<ComponentProps<T>> | null, children?: VNodeChildren, _conf?: Option) =>
        useComponent(component, _conf || config)(props, children);
    if (instance) {
        if (!component.name) {
            if (import.meta.env.DEV) console.error('组件未设置 name');
            return component as CreateComponent<T>;
        }
        // 为全局属性暴露补充声明
        instance.appContext.config.globalProperties[camelize(`$create-${component.name}`)] = function insetCreate(this: ComponentInternalInstance | void, props?: MaybeRefProps<ComponentProps<T>> | null, children?: VNodeChildren, config?: Option) {
            return useComponent(component, config, this?.uid ? this : instance || globalInstance?._instance)(props, children);
        };
    }
    return component as CreateComponent<T>;
}

/** 已挂载的组件(上下文 uid 和组件名称作为key) */
const mountComponent: Record<string, CustomVNode<any>> = {};
/** 已挂载的组件需要传递的值 */
const mountComponentExtraAttrs: Record<string, Partial<Record<'props' | 'slots', any>>> = {};
/** 为匿名组件设置名称 */
const componentName = new WeakMap<Component, string>();
/** 非唯一组件或匿名组件时的自增值 */
let seed = 0;

/**
 * 渲染组件
 * @param {Component} comp 需渲染的组件
 * @param {Option | ComponentInternalInstance} [conf] 配置项或 vue 组件实例
 * @param {ComponentInternalInstance} [ins] vue 组件实例
 *
 */
export function useComponent<T extends Component>(comp: T, conf?: Option | ComponentInternalInstance | null, ins?: ComponentInternalInstance | null) {
    const outsideInstance = (isInstance(conf) ? conf : ins);
    let instance = outsideInstance || getCurrentInstance() || globalInstance?._instance;
    const config = { ...DEFAULT_OPTION } as Option;
    conf && !isInstance(conf) && Object.assign(config, conf);
    instance?.proxy?.[CONFIG_KEY] && Object.assign(config, instance.proxy[CONFIG_KEY]);

    if (config.global && instance) instance = instance.root;
    componentName.has(comp) || componentName.set(comp, comp.name || `anonymous${++seed}`);
    const KEY = `${instance?.uid || ''}_${componentName.get(comp)}_${(config.single && ++seed) || ''}`;
    const carryCallback: UseComponentReturn<T> = function carryCallback(props?: MaybeRefProps<ComponentProps<T>> | null, children?: VNodeChildren) {
        mountComponentExtraAttrs[KEY] || (mountComponentExtraAttrs[KEY] = {});
        updateProps(props, config.mergeProps);
        updateSlots(children);
        mount();

        /** 显示组件 */
        function show(...args: any[]) {
            if (import.meta.hot) {
                if (!mountComponent[KEY].component?.refs[CHILD_REF]?.$unmount) {
                    mountComponent[KEY][CHILD_REF] = mountComponent[KEY].component!.refs[CHILD_REF]!;
                    interceptComponentMethod();
                }
            }
            update();
            nextTick(() => {
                // @ts-expect-error 调用组件内部的 show 事件
                mountComponent[KEY]?.[CHILD_REF]?.nativeShow?.(...args);
            });
            return mountComponent[KEY][CHILD_REF] as CustomComponent<T>;
        }
        /** 隐藏组件 */
        function hide(...args: any[]) {
            // @ts-expect-error 调用组件内部的 hide 事件
            mountComponent[KEY]?.[CHILD_REF]?.nativeHide?.(...args);
            return mountComponent[KEY][CHILD_REF] as CustomComponent<T>;
        }
        /** 挂载组件 */
        function mount() {
            if (mountComponent[KEY]) return;
            mountComponent[KEY] = h({ render: () => h(comp, { ...mountComponentExtraAttrs[KEY].props, ref: CHILD_REF }, mountComponentExtraAttrs[KEY].slots) }) as CustomVNode<T>;
            instance?.appContext && (mountComponent[KEY].appContext = {
                ...instance.appContext,
                // @ts-expect-error 实例没有对 provides 进行声明
                provides: instance.provides || instance.appContext.provides,
            });
            mountComponent[KEY][CONTAINER] = getDom(config.appendTo!).appendChild(document.createElement('div'));
            render(mountComponent[KEY], mountComponent[KEY][CONTAINER]!);
            mountComponent[KEY][CHILD_REF] = mountComponent[KEY].component!.refs[CHILD_REF]!;
            // 监听父级组件销毁事件
            instance && (instance.vnode.props = mergeProps(instance.vnode.props || {}, { onVnodeBeforeUnmount: unmount }));
            interceptComponentMethod();
        }
        /** 拦截并重写组件上特定的方法 */
        function interceptComponentMethod() {
            Object.assign(mountComponent[KEY][CHILD_REF], {
                nativeShow: mountComponent[KEY][CHILD_REF].show,
                nativeHide: mountComponent[KEY][CHILD_REF].hide,
                show,
                hide,
                $updateProps: updatePropsAndUpdate,
                $updateSlots: updateSlots,
                $forceUpdate: update,
                $unmount: unmount,
            });
        }
        /** 卸载组件 */
        function unmount() {
            componentName.delete(comp);
            if (!mountComponent[KEY]) return;
            if (mountComponent[KEY][CONTAINER]) {
                render(null, mountComponent[KEY][CONTAINER]!);
                mountComponent[KEY][CONTAINER]!.parentElement?.removeChild(mountComponent[KEY][CONTAINER]!);
                mountComponent[KEY][CONTAINER] = null;
            }
            delete mountComponent[KEY];
            delete mountComponentExtraAttrs[KEY];
        }
        /** 更新 props 且刷新组件 */
        function updatePropsAndUpdate(...args: Parameters<typeof updateProps>) {
            updateProps(...args);
            update();
            return mountComponent[KEY][CHILD_REF] as CustomComponent<T>;
        }
        /** 更新 props */
        function updateProps(props: Record<string, any> | undefined | null, merge?: boolean) {
            if (!props) return false;
            if (!mountComponentExtraAttrs[KEY]) return false;
            mountComponentExtraAttrs[KEY].props = merge
                ? mergeProps(
                    mountComponent[KEY].props || {},
                    reactive(props),
                )
                : reactive(props);
            return true;
        }
        /** 更新插槽 */
        function updateSlots(children?: VNodeChildren | null): CustomComponent<T> {
            if (!mountComponentExtraAttrs[KEY]) return mountComponent[KEY]?.[CHILD_REF] as CustomComponent<T>;
            if (mountComponentExtraAttrs[KEY].slots === children) return mountComponent[KEY]?.[CHILD_REF] as CustomComponent<T>;
            mountComponentExtraAttrs[KEY].slots = children;
            return update();
        }
        /** 更新组件 tips 刷新是等到下个周期才会更新 props, 所以 show 需要在 nextTick 内执行 */
        function update() {
            mountComponent[KEY]?.component?.proxy?.$forceUpdate();
            return mountComponent[KEY]?.[CHILD_REF] as CustomComponent<T>;
        }

        return mountComponent[KEY][CHILD_REF] as CustomComponent<T>;
    };
    carryCallback.hasInstance = () => {
        return !!mountComponent[KEY]?.[CHILD_REF];
    };
    carryCallback.getInstance = () => {
        return carryCallback.hasInstance() ? mountComponent[KEY][CHILD_REF] as CustomComponent<T> : carryCallback();
    };
    carryCallback.updateProps = (props, merge) => {
        const status = carryCallback.hasInstance();
        status && carryCallback.getInstance().$updateProps(props, merge);
        return status;
    };
    carryCallback.updateSlots = (children) => {
        const status = carryCallback.hasInstance();
        status && carryCallback.getInstance().$updateSlots(children);
        return status;
    };
    return carryCallback;
}

/** 判断是否是实例 */
function isInstance(val: any): val is ComponentInternalInstance {
    return val && typeof val === 'object' && 'uid' in val;
}

/** 获取 dom 节点 */
function getDom(value: NonNullable<Option['appendTo']>) {
    return typeof value === 'string'
        ? document.body.querySelector(value)!
        : typeof value === 'object'
            ? value
            : value();
}
