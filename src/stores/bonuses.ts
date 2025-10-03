import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useBonusesStore = defineStore('bonuses', () => {
    const currentPage = ref(1)
    const pageSize = ref(20)
    const fetchLimit = ref(20)

    const activeSort = ref<'ID' | 'NAME' | 'PHONE' | 'BONUSES'>('NAME')
    const isDesc = ref(true)

    const totalAvailable = ref(137) // симуляция сколько записей на бэке
    const pageItems = ref<any[]>([])

    function makeItem(id: number) {
        const baseNumber = 9001000000 + id
        return {
            ID: id,
            NAME: `User ${id}`,
            PHONE: formatPhone(baseNumber),
            BONUSES: (id * 37) % 5000,
        }
    }

    function formatPhone(num: number): string {
        const s = num.toString().padStart(10, '0')
        return `+7 ${s.substring(0, 3)} ${s.substring(3, 6)} ${s.substring(6, 8)} ${s.substring(8)}`
    }

    const totalFetched = computed(() => Math.min(fetchLimit.value, totalAvailable.value))

    const navSize = computed(() => Math.ceil(totalFetched.value / pageSize.value))

    const pagedData = computed(() => pageItems.value)

    function loadFakeData(page = currentPage.value, limit = fetchLimit.value) {
        const total = Math.min(limit, totalAvailable.value)

        let items = Array.from({ length: total }, (_, i) => makeItem(i + 1))

        const sortKey = activeSort.value
        items.sort((a: any, b: any) => {
            switch (sortKey) {
                case 'ID':
                case 'BONUSES':
                    return Number(a[sortKey] - Number(b[sortKey]))
                
                case 'PHONE': {
                    const numA = parseInt(a.PHONE.replace(/\D+/g, ''), 10)
                    const numB = parseInt(b.PHONE.replace(/\D+/g, ''), 10)
                    return numA - numB
                }

                case 'NAME':
                    return a.NAME.localeCompare(b.NAME, undefined, { numeric: true, sensitivity: 'base' })
            }
        })
        if (isDesc.value) {
            items.reverse()
        }

        const start = (page - 1) * pageSize.value
        const end = Math.min(start + pageSize.value, total)
        pageItems.value = items.slice(start, end)
        currentPage.value = page
    }

    function sort(sortType: 'ID' | 'NAME' | 'PHONE' | 'BONUSES') {
        if (activeSort.value !== sortType) {
            activeSort.value = sortType
            isDesc.value = true
        } else {
            isDesc.value = !isDesc.value
        }
        loadFakeData(currentPage.value, fetchLimit.value)
    }

    function searchServer(query: string) {
        const q = query.toLocaleLowerCase()
        const total = totalAvailable.value
        const all = Array.from({ length: total }, (_, i) => makeItem(i + 1))
        
        return all.filter((row) =>
            String(row.ID).includes(q) ||
            row.NAME.toLowerCase().includes(q) ||
            row.PHONE.toLowerCase().includes(q) ||
            String(row.BONUSES).includes(q)
        )
    }

    return {
        currentPage,
        pageSize,
        fetchLimit,
        activeSort,
        isDesc,
        totalAvailable,

        navSize,
        pagedData,
        totalFetched,

        loadFakeData,
        sort,
        searchServer,
    }
})