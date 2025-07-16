<template>
  <div class="min-h-[600px] w-full rounded-[25px] shadow-2xl">
    <div
      :class="`${getClassColsTabItem.value} relative grid w-full h-[68px] bg-dark_primary rounded-[25px]`"
    >
      <div
        v-for="(tabItem, index) in tabItems"
        :key="tabItem.name"
        class="flex items-center justify-center w-full h-full text-white text-[1.2rem] font-semibold cursor-pointer select-none"
        @click="setCurrentTab(index)"
      >
        {{ tabItem.title }}
      </div>
      <div
        :class="`${getClassMaker.value} absolute top-0 h-full bg-[rgba(255,255,255,0.3)] 
        rounded-[25px] transition-all duration-300 ease-in-out`"
      ></div>
    </div>

    <div class="mt-[50px] flex justify-center">
      <keep-alive>
        <component :is="currentComponent.value" />
      </keep-alive>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'

const props = defineProps({
  tabItems: {
    type: Array,
    default: () => [],
  },
})

const currentTab = ref(0)
const currentComponent = ref(props.tabItems[0]?.component)

const setCurrentTab = (index) => {
  currentTab.value = index
  currentComponent.value = props.tabItems[currentTab.value]?.component
}

const getClassColsTabItem = computed(() => {
  return `grid-cols-${props.tabItems.length}`
})

const getClassMaker = computed(() => {
  const width = Number.parseFloat(100 / props.tabItems.length).toFixed(2)
  const leftPosition = currentTab.value * 100
  return `w-[${width}%] translate-x-[${leftPosition}%]`
})
</script>