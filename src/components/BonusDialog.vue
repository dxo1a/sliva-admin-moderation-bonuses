<script setup lang="ts">
import { VDialog, VCard, VCardTitle, VCardText, VTextField, VBtn } from 'vuetify/components';

import { ref } from 'vue'

const props = defineProps<{
    type: 'add' | 'remove' | 'adjust'
    row: any
    modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const newValue = ref<number | null>(null)

function close() {
    emit('update:modelValue', false)
}

function save() {
    console.log('Сохранено', props.type, 'для', props.row, 'значение', newValue.value)
    close()
}
</script>
<template>
    <VDialog v-model="props.modelValue" max-width="400" max-height="600">
        <VCard>
            <VCardText>
                <label class="m-[38px_50px_40px_50px] text-[32px] block text-center">{{ props.type === 'adjust' ? 'Корректировка' : props.type === 'add' ? 'Начислить' : 'Списать' }}</label>
                <div class="grid grid-cols-[96px_230px] items-center">
                    <img src="../assets/img/profile.png" alt="" class="w-[96px] h-[96px] object-contain" />
                    <div class="ml-[22px]">
                        <p>ФИО: {{ props.row.NAME }}</p>
                        <p>{{ props.row.PHONE }}</p>
                    </div>
                </div>
                <div class="mt-[28px]">
                    <p class="mb-[10px]">Баллы до операции:</p>
                    <VTextField disabled>{{ props.row.BONUSES }}</VTextField>
                </div>

                <div v-if="props.type === 'adjust'">
                    <p class="mb-[10px]">Баллы после операции:</p>
                    <VTextField v-model="newValue" type="number" />
                </div>
                <div v-else>
                    <p class="mb-[10px]">{{ props.type === 'add' ? 'Прибавить' : 'Списать' }}</p>
                    <VTextField v-model="newValue" type="number" />
                </div>
            </VCardText>

            <div class="flex justify-center gap-2 p-4">
                <button class="p-[14px_4px] border-red-400 border-[2px] text-red-400 hover:bg-red-400 hover:text-white transition" @click="close">ОТМЕНА</button>
                <button class="p-[14px_4px] border-lime-400 border-[2px] text-lime-400 hover:bg-lime-400 hover:text-white transition" @click="save">СОХРАНИТЬ</button>
            </div>
        </VCard>
    </VDialog>
</template>