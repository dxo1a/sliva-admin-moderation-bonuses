<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
const Table = defineAsyncComponent(() => import('./components/Table.vue'))
</script>

<template>
  <Transition name="fade" mode="out-in">
    <Suspense>
      <template #default>
            <Table />
      </template>
      <template #fallback>
        <div class="loading-placeholder">Загрузка...</div>
      </template>
    </Suspense>
  </Transition>
</template>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.loading-placeholder {
  opacity: 0.5;
  padding: 20px;
  text-align: center;
}
</style>
