import type { CreateFn } from '../../src/index';
import type Lump from '../components/lump.vue';

declare module 'vue' {
    interface ComponentCustomProperties {
        $createAca: CreateFn<typeof Lump>;
    }
}
