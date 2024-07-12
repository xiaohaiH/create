import type { CONFIG_KEY } from '../lib/config';
import type { Option } from '../lib/types';

declare module 'vue' {
    interface ComponentCustomProperties {
        [CONFIG_KEY]?: Option;
    }
}
