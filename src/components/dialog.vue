<template>
    <ElDialog v-model:model-value="visible" :title="title">
        弹窗
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
