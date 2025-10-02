import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useBonusesStore = defineStore('bonuses', () => {
    const currentPage = ref(1)
    const pageSize = ref(20)

    const activeSort = ref<'ID' | 'NAME' | 'PHONE' | 'BONUSES'>('NAME')
    const isDesc = ref(true)

    const data = ref<any[]>([])

    function div(val: number, by: number) {
        return Math.ceil(val / by)
    }

    const navSize = computed(() => div(data.value.length, pageSize.value))

    function loadFakeData(page = currentPage.value, size = pageSize.value) {
        data.value = Array.from({ length: 137 }, (_, i) => ({
            ID: i + 1,
            NAME: `User ${i + 1}`,
            PHONE: `+7 900 ${1000 + i}`,
            BONUSES: Math.floor(Math.random() * 5000),
        }))
    }

    function sort(sortType: 'ID' | 'NAME' | 'PHONE' | 'BONUSES') {
        if (activeSort.value !== sortType) {
            activeSort.value = sortType
            isDesc.value = true

            switch (sortType) {
                case 'ID':
                    data.value.sort((a, b) => parseInt(a.ID) - parseInt(b.ID))
                    break
                case 'NAME':
                    data.value.sort((a, b) => a.NAME.localeCompare(b.NAME))
                    break
                case 'PHONE':
                    data.value.sort((a, b) => a.PHONE.localeCompare(b.PHONE))
                    break
                case 'BONUSES':
                    data.value.sort((a, b) => parseInt(a.BONUSES) - parseInt(b.BONUSES))
                    break
            }
        } else {
            data.value.reverse()
            isDesc.value = !isDesc.value
        }
    }

    const pagedData = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value
        return data.value.slice(start, end)
    })

    return {
        currentPage,
        pageSize,
        activeSort,
        isDesc,
        data,
        navSize,

        pagedData,
        
        loadFakeData,
        sort,
    }
})