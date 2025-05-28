<template>
    <ElDialog v-model:model-value="visible" :title="title" v-bind="$attrs">
        <slot />
        <div>弹窗</div>
    </ElDialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
    title: string;
}>();

const visible = ref(false);

function show() {
    visible.value = true;
}
function hide() {
    visible.value = false;
}

defineExpose({
    show,
    hide,
});
</script>

<style lang="scss" scoped>
</style>
