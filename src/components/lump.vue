<template>
    <div class="absolute left-[calc(50%-100px)] top-[calc(50%-100px)] size-200px bg-pink">
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
const props = defineProps<{ name?: string }>();
</script>

<style lang="scss" scoped>
</style>
