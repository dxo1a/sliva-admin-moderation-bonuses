<script setup lang="ts">
import Table from './components/Table.vue';
</script>

<template>
  <Transition name="loading">
    <Suspense>
      <template #default>
        <Table></Table>
      </template>
      <template #fallback> Загрузка </template>
    </Suspense>
  </Transition>
</template>

<style scoped>
.loading-enter-active,
.loading-leave-active {
  transition: opacity 3500ms ease;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}
</style>
