<template>
  <button
    v-if="type === 'button'"
    :type="type"
    :class="`outline-none min-w-[120px] text-[1.2rem] rounded-[20px] select-none ${renderClassSize} ${renderClassColor}`"
    @click="handleClick"
  >
    <slot />
  </button>

  <NuxtLink v-else-if="type === 'link'" :to="to">
    <slot />
  </NuxtLink>

  <input
    v-else-if="type === 'submit'"
    type="submit"
    :value="nameButton"
    :class="`outline-none min-w-[120px] text-[1.2rem] rounded-[20px] cursor-pointer ${renderClassSize} ${renderClassColor}`"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button',
  },
  size: {
    type: String,
    default: 'medium',
  },
  color: {
    type: String,
    default: '#ff7200',
  },
  variant: {
    type: String,
    default: 'contained',
  },
  handleClick: {
    type: Function,
    default: () => () => {},
  },
  nameButton: {
    type: String,
    default: 'Submit',
  },
  to: {
    type: [String, Object],
    default: '/',
  },
})

const renderClassSize = computed(() => {
  const sizeMap = {
    small: ['4px', '8px'],
    medium: ['6px', '12px'],
    large: ['8px', '16px'],
  }
  const [py, px] = sizeMap[props.size] || sizeMap.medium
  return `py-[${py}] px-[${px}]`
})

const renderClassColor = computed(() => {
  if (props.variant === 'contained') {
    return `text-white bg-[${props.color}] border border-[${props.color}] hover:opacity-70`
  } else {
    return `text-[${props.color}] bg-white border border-[${props.color}] hover:text-white hover:bg-[${props.color}]`
  }
})
</script>
