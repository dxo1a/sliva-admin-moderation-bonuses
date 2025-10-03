<script lang="ts" setup>
import { VSelect, VPagination, VTextField } from 'vuetify/components';
import TableRow from './TableRow.vue';
import BonusDialog from './BonusDialog.vue';

import { ref, onMounted, computed, watch } from 'vue';
import { useBonusesStore } from '@/stores/bonuses';

const bonuses = useBonusesStore()

const activeMenuId = ref<number | null>(null)
function toggleMenu(id: number) {
    activeMenuId.value = activeMenuId.value === id ? null : id
}

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'remove' | 'adjust' | null>(null)
const selectedRow = ref<any>(null)
function openDialog(payload: {type: 'add' | 'remove' | 'adjust', row: any }) {
    dialogType.value = payload.type
    selectedRow.value = payload.row
    dialogVisible.value = true
}

const searchQuery = ref('')
const searchResults = ref<any[]>([])
const searching = ref(false)

const filteredData = computed(() => {
    if (!searchQuery.value) {
        return bonuses.pagedData
    }

    const q = searchQuery.value.toLowerCase()
    const localMatches = bonuses.pagedData.filter((row: any) =>
        String(row.ID).includes(q) ||
        row.NAME.toLowerCase().includes(q) ||
        row.PHONE.toLowerCase().includes(q) ||
        String(row.BONUSES).includes(q)
    )

    return localMatches
})

async function handleSearch() {
    if (!searchQuery.value) {
        searchResults.value = []
        return
    }

    const localMatches = filteredData.value
    if (localMatches.length > 0) {
        searchResults.value = localMatches
        return
    }

    // если локально пусто, то запрос на бэк (?)
    searching.value = true
    try {
        const data = bonuses.searchServer(searchQuery.value)
        searchResults.value = data
    } catch (e) {
        console.error(e)
        searchResults.value = []
    } finally {
        searching.value = false
    }
}

watch(
    () => bonuses.fetchLimit,
    (newLimit) => {
        bonuses.currentPage = 1
        bonuses.loadFakeData(1, newLimit)
    }
)

watch(
    () => bonuses.currentPage,
    (newPage) => {
        bonuses.loadFakeData(newPage, bonuses.fetchLimit)
    }
)

const tableLoading = ref(true)

const wait = () => {
    return new Promise(resolve => {
        return setTimeout(resolve, 3000) 
    })
}
await wait()

onMounted(() => {
    bonuses.loadFakeData(1, bonuses.fetchLimit)
    tableLoading.value = false
})
</script>

<template>
    <div v-if="!tableLoading">
        <div class="adm-bonuses-controls">
            <div class="adm-select-pagen">
                <span style="height: fit-content">Элементов на странице:</span>
                <VSelect
                    density="compact"
                    v-model="bonuses.fetchLimit"
                    variant="solo-filled"
                    :items="[10, 20, 100, 500]"
                >
                </VSelect>
            </div>

            <div class="relative">
                <input @keyup.enter="handleSearch" v-model="searchQuery" class="min-w-[500px] min-h-[32px] border-[2px] border-[var(--blue)] pl-[6px]" placeholder="Поиск"/>
                <button @click="handleSearch" class="w-[32px] h-[32px] absolute right-0 rounded-l-xl hover:bg-[var(--blue)] transition">
                    <svg class="ml-[3px]" width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.1597 20.69C16.9811 20.69 20.8897 16.7814 20.8897 11.96C20.8897 7.13853 16.9811 3.22998 12.1597 3.22998C7.33824 3.22998 3.42969 7.13853 3.42969 11.96C3.42969 16.7814 7.33824 20.69 12.1597 20.69Z" stroke="black" stroke-width="2.3" stroke-miterlimit="10"></path>
                        <path d="M17.9609 18.16L26.5809 26.77" stroke="black" stroke-width="2.3" stroke-miterlimit="10"></path>
                    </svg>
                </button>
            </div>

            <div v-if="bonuses.navSize >= 1" class="adm-bonuses-control">
                <VPagination total-visible="7" v-model="bonuses.currentPage" :length="bonuses.navSize"></VPagination>
            </div>
        </div>

        <div class="adm-bonuses-moderation-table" role="table">
            <div style="width: 100%" role="heading-cell" ></div>
            <button
                role="heading-cell"
                :class="{ activeSort: bonuses.activeSort === 'ID', descSort: bonuses.isDesc, ascSort: !bonuses.isDesc }"
                @click="bonuses.sort('ID')"
            >
                ID
            </button>
            <button
                role="heading-cell"
                :class="{ activeSort: bonuses.activeSort === 'NAME', descSort: bonuses.isDesc, ascSort: !bonuses.isDesc }"
                @click="bonuses.sort('NAME')"
            >
                ФИО пользователя
            </button>
            <button
                role="heading-cell"
                :class="{ activeSort: bonuses.activeSort === 'PHONE', descSort: bonuses.isDesc, ascSort: !bonuses.isDesc }"
                @click="bonuses.sort('PHONE')"
            >
                Телефон
            </button>
            <button
                role="heading-cell"
                :class="{ activeSort: bonuses.activeSort === 'BONUSES', descSort: bonuses.isDesc, ascSort: !bonuses.isDesc }"
                @click="bonuses.sort('BONUSES')"
            >
                Бонусы
            </button>
            <TableRow
                v-for="row in (searchResults.length ? searchResults : filteredData)"
                :key="row.ID"
                :rowData="row"
                :menuActive="activeMenuId === row.ID"
                @toggleMenu="toggleMenu"
                @openDialog="openDialog"
            />
        </div>

        <div class="adm-bonuses-controls">
            <div class="adm-select-pagen">
                <span style="height: fit-content">Элементов на странице:</span>
                <VSelect
                    density="compact"
                    v-model="bonuses.fetchLimit"
                    variant="solo-filled"
                    :items="[10, 20, 100, 500]"
                >
                </VSelect>
            </div>

            <div v-if="bonuses.navSize >= 1" class="adm-bonuses-control">
                <VPagination total-visible="7" v-model="bonuses.currentPage" :length="bonuses.navSize"></VPagination>
            </div>
        </div>
    </div>

    <BonusDialog
        v-if="dialogVisible && dialogType"
        v-model="dialogVisible"
        :type="dialogType"
        :row="selectedRow"
    />
</template>

<style lang="css">
.adm-bonuses-controls {
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.adm-select-pagen {
    max-width: 400px;
    display: flex;
    gap: 20px;
    justify-content: center;
    height: fit-content;
    align-items: flex-start;
}

.adm-bonuses-moderation-table {
    display: grid;
    grid-template-columns: 0.5fr 1fr 3.5fr 3.5fr 1fr;
    row-gap: 1px;
    border-bottom: 1px solid var(--blue);
    border-left: 1px solid var(--blue);
    border-right: 1px solid var(--blue);

    & > * {
      padding: 27px 17px;
      transition: 0.3s;
      background: var(--white);
      &.activeSort {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        background: #009bf3;
        &.descSort::after {
          display: block;
          content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='8' viewBox='0 0 10 8' fill='none'%3E%3Cpath d='M5 8L9.33013 0.5H0.669873L5 8Z' fill='white'/%3E%3C/svg%3E");
        }
        &.ascSort::after {
          display: block;
          transform: rotate(180deg);
          content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='8' viewBox='0 0 10 8' fill='none'%3E%3Cpath d='M5 8L9.33013 0.5H0.669873L5 8Z' fill='white'/%3E%3C/svg%3E");
        }
      }
      &.descSort::after,
      &.ascSort::after {
        display: none;
      }
    }
    & > [role='heading-cell'] {
      background: var(--blue);
      color: var(--white);
      font-size: 20px;
      & > *{

        padding: 17px;
        font-weight: 800;
      }
    }
    & > button{
      text-align: left;
    }
}

.adm-bonuses-moderation-table > [role='heading-cell'] {
    background-color: var(--blue);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>