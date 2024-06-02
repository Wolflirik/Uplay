<template>
    <div class="filter">
        <button-element v-for="filter in filters" :key="filter.fieldName" type="link" class="filter__item" @click="setFilter(filter.fieldName)">
            <span>{{ filter.name }}</span>
            <icon-element :name="getDirectionIcon(filter.fieldName)"></icon-element>
        </button-element>
    </div>
</template>
<script setup>
import ButtonElement from '@element/ButtonElement.vue'
import IconElement from '@element/IconElement.vue'

const props = defineProps({
    filters: {
        type: Object,
        required: true,
    },
    selectedField: {
        type: String,
        required: true,
    },
    selectedDirection: {
        type: String,
        required: true,
        validator(prop) {
            return ['asc', 'desc'].includes(prop)
        },
    },
})

const emits = defineEmits(['filter'])

const getDirectionIcon = fieldName => {
    let directionIcon = ''

    if (fieldName === props.selectedField) {
        directionIcon = props.selectedDirection === 'asc' ? 'arrow-down' : 'arrow-up'
    }

    return directionIcon
}

const invertDirection = fieldName => {
    let direction = 'asc'

    if (fieldName === props.selectedField) {
        direction = props.selectedDirection === 'asc' ? 'desc' : 'asc'
    }

    return direction
}

const setFilter = fieldName => {
    emits('filter', {
        field: fieldName,
        direction: invertDirection(fieldName),
    })
}
</script>
