import type { CONFIG_KEY, Option, create } from '../lib/index';

declare module 'vue' {
    interface ComponentCustomProperties {
        [CONFIG_KEY]?: Option;
        $create: typeof create;
    }
}
