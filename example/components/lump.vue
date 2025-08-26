<template>
    <div :class="{ absolute }" class="left-[calc(50%-100px)] top-[calc(50%-100px)] size-200px bg-pink">
        色块{{ name }}
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

/**
 * @file
 */
defineOptions({
    name: 'Aca',
});
const props = defineProps<{ name?: string; absolute?: boolean }>();

console.log(props.name, 11);

defineExpose({
    /** 哈哈哈 */
    show: (value: string) => true,
    // hide: (value: string, a: number) => true,
});
</script>

<style lang="scss" scoped>
</style>
