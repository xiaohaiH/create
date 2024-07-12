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
