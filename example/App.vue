<template>
    <div class="size-full center">
        <ElCard class="size-95%">
            <div class="ml--12px mt--10px flex flex-wrap">
                <ElButton class="ml-12px mt-10px" @click="dialog">
                    触发弹窗
                </ElButton>
                <div class="relative ml-12px mt-10px flex">
                    <ElButton class="op-0">
                        销毁弹窗
                    </ElButton>
                    <ElButton class="absolute top-1px z-9999 !mx-0" @click="dialogDestroy">
                        销毁弹窗
                    </ElButton>
                </div>
                <div class="relative ml-12px mt-10px flex">
                    <ElButton class="op-0">
                        弹窗实例存在?
                    </ElButton>
                    <ElButton class="absolute top-1px z-9999 !mx-0" @click="dialogHasInstance()">
                        弹窗实例存在?
                    </ElButton>
                </div>
                <div v-show="dialogVisible" class="relative ml-12px mt-10px flex">
                    <ElButton class="op-0">
                        更新弹窗标题
                    </ElButton>
                    <ElButton class="absolute top-1px z-9999 !mx-0" @click="dialogUpdateProps({ title: '新的弹窗标题' })">
                        更新弹窗标题
                    </ElButton>
                </div>
                <div v-show="dialogVisible" class="relative ml-12px mt-10px flex">
                    <ElButton class="op-0">
                        更新弹窗插槽
                    </ElButton>
                    <ElButton class="absolute top-1px z-9999 !mx-0" @click="dialogUpdateSlots({ default: () => '新的插槽内容' })">
                        更新弹窗插槽
                    </ElButton>
                </div>
                <ElButton class="ml-12px mt-10px" @click="toggleLump(true)">
                    显示色块
                </ElButton>
                <ElButton class="ml-12px mt-10px" @click="toggleLump(false)">
                    隐藏色块
                </ElButton>
                <ElButton class="ml-12px mt-10px" @click="toggleLump2(true)">
                    显示色块2
                </ElButton>
                <ElButton class="ml-12px mt-10px" @click="toggleLump2(false)">
                    隐藏色块2
                </ElButton>
            </div>

            <div class="custom-container mt-10px inline-flex flex-col b b-black b-op-60 rd-2px b-solid px-10px py-4px">
                <span class="not-last:pb-6px">色块二渲染容器</span>
            </div>
        </ElCard>
    </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue';
import { create, useComponent } from '../src/index';
import HDialog from './components/dialog.vue';
import Lump from './components/lump.vue';

export default defineComponent({
    setup() {
        const dialogComponent = useComponent(HDialog);
        const colorLump = useComponent(Lump, { single: false, global: false });
        const color2Lump = useComponent(Lump, { single: false, global: true, appendTo: '.custom-container' });

        const instance = getCurrentInstance();
        instance!.proxy!.$create(Lump);
        create(Lump, instance);

        // const name = ref('aaa');
        // instance?.proxy?.$createAca({ name }).show();
        // console.log(instance, name);

        const props = reactive({ name: 'reactive - 通过调用组件本身方法渲染', absolute: true });
        instance?.proxy?.$createAca(props).show();
        console.log(instance, props);

        const dialogVisible = ref(false);
        /** 显示弹窗 */
        function dialog() {
            dialogVisible.value = true;
            dialogComponent({
                title: '显示弹窗',
                onClose() {
                    dialogVisible.value = false;
                },
            }).show();
        }
        /** 销毁弹窗 */
        function dialogDestroy() {
            if (dialogComponent.hasInstance()) {
                dialogComponent.getInstance().$unmount();
                dialogVisible.value = false;
            }
            else {
                ElMessage.warning('弹窗实例不存在');
            }
        }
        function dialogHasInstance() {
            ElMessage.success(dialogComponent.hasInstance().toString());
        }
        function dialogUpdateProps(props: Record<'title', any>) {
            dialogComponent.updateProps(props);
        }
        function dialogUpdateSlots(children: any) {
            dialogComponent.updateSlots(children);
        }
        function toggleLump(status?: boolean) {
            status ? colorLump({ name: '1', absolute: true }).show() : colorLump().$unmount();
        }
        function toggleLump2(status?: boolean) {
            status ? color2Lump({ name: '2' }).show() : color2Lump().$unmount();
        }

        return {
            dialog,
            dialogDestroy,
            dialogVisible,
            dialogHasInstance,
            dialogUpdateProps,
            dialogUpdateSlots,
            toggleLump,
            toggleLump2,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
