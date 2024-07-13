<template>
    <div class="size-full center">
        <ElCard class="size-95%">
            <ElButton @click="dialog">
                触发弹窗
            </ElButton>
            <ElButton @click="toggleLump(true)">
                显示色块
            </ElButton>
            <ElButton @click="toggleLump(false)">
                隐藏色块
            </ElButton>
            <ElButton @click="toggleLump2(true)">
                显示色块2
            </ElButton>
            <ElButton @click="toggleLump2(false)">
                隐藏色块2
            </ElButton>
        </ElCard>
    </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue';
import { create, useComponent } from '../lib/index';
import Lump from './components/lump.vue';
import HDialog from './components/dialog.vue';

export default defineComponent({
    setup() {
        const dialogComponent = useComponent(HDialog);
        const colorLump = useComponent(Lump, { single: false, global: false });
        const color2Lump = useComponent(Lump, { single: false, global: true });

        const instance = getCurrentInstance();
        instance!.proxy!.$create(Lump);
        create(Lump, instance);

        // const name = ref('aaa');
        // instance?.proxy?.$createAca({ name }).show();
        // console.log(instance, name);

        const props = reactive({ name: 'reactive' });
        instance?.proxy?.$createAca(props).show();
        console.log(instance, props);

        /** 显示弹窗 */
        function dialog() {
            dialogComponent({
                title: '显示弹窗',
            }).show();
        }
        function toggleLump(status?: boolean) {
            status ? colorLump({ name: '1' }).show() : colorLump().$unmount();
        }
        function toggleLump2(status?: boolean) {
            status ? color2Lump({ name: '2' }).show() : color2Lump().$unmount();
        }

        return {
            dialog,
            toggleLump,
            toggleLump2,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
