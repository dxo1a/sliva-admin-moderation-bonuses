<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    rowData: {
        ID: number
        NAME: string
        PHONE: string
        BONUSES: number
    }
    menuActive: boolean
}>()

const emit = defineEmits<{
    (e: 'toggleMenu', id: number): void
    (e: 'openDialog', payload: { type: 'add' | 'remove' | 'adjust', row: any}): void
}>()

function choose(action: 'add' | 'remove' | 'adjust') {
    emit('openDialog', { type: action, row: props.rowData })
    emit('toggleMenu', 0)
}

function onMenuClick() {
    emit('toggleMenu', props.rowData.ID)
}

</script>
<template>
    <div class="row" role="row">
        <div role="cell">
            <button @click="onMenuClick">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30" fill="none">
                    <path
                    d="M23.7522 11.3926L18.6413 6.25006C18.5656 6.16539 18.4719 6.09905 18.3672 6.056C18.2625 6.01295 18.1494 5.99432 18.0365 6.0015C17.9232 6.00308 17.8113 6.0274 17.7075 6.07302C17.6036 6.11865 17.5099 6.18466 17.4317 6.2672L1.24703 23.409C1.09171 23.5665 1.00316 23.7785 1 24.0004V29.1429C1 29.6163 1.38135 30 1.85182 30H17.1847C17.6551 30 18.0365 29.6163 18.0365 29.1429C18.0365 28.6695 17.6551 28.2858 17.1847 28.2858H8.94752L23.7607 12.5925C24.083 12.2569 24.0793 11.7235 23.7522 11.3926ZM2.70365 28.2858V24.3432L14.8762 11.4869L18.7861 15.4123L6.59648 28.2858H2.70365ZM19.9531 14.1353L16.0517 10.2098L18.0365 8.08423L21.9549 12.0011L19.9531 14.1353ZM23.1474 29.1429C23.1474 29.6163 22.7661 30 22.2956 30C21.8251 30 21.4438 29.6163 21.4438 29.1429C21.4438 28.6695 21.8251 28.2858 22.2956 28.2858C22.7661 28.2858 23.1474 28.6696 23.1474 29.1429ZM20.5919 29.1429C20.5919 29.6163 20.2106 30 19.7401 30C19.2696 30 18.8883 29.6163 18.8883 29.1429C18.8883 28.6695 19.2696 28.2858 19.7401 28.2858C20.2106 28.2858 20.5919 28.6696 20.5919 29.1429Z"
                    fill="#AA51B9" />
                </svg>
            </button>
            <div v-if="props.menuActive" class="absolute shadow-2xl bg-white z-10">
                <button @click="choose('add')" class="menu-item hover:bg-gray-200 transition">Начислить</button>
                <button @click="choose('remove')" class="menu-item hover:bg-gray-200 transition">Списать</button>
                <button @click="choose('adjust')" class="menu-item hover:bg-gray-200 transition">Корректировка баланса</button>
            </div>
        </div>

        <div role="cell">{{ props.rowData.ID }}</div>
        <div role="cell">{{ props.rowData.NAME }}</div>
        <div role="cell">{{ props.rowData.PHONE }}</div>
        <div role="cell">{{ props.rowData.BONUSES }}</div>
    </div>
</template>

<style scoped>
.row {
    display: contents;
}

.row > div {
    padding: 12px 17px;
    position: relative;
}

.menu-item {
    width: 100%;
    padding: 6px 16px;
    line-height: 1.25rem;
    text-align: left;
}
</style>