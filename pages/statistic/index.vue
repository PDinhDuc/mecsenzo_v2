<template>
  <div class="max-w-[1200px] h-[calc(100vh-100px)] m-auto relative top-[100px]">
    <div
      v-if="isShowLoader"
      class="h-[400px] m-auto flex items-center justify-center"
    >
      <LoaderSideConversation />
    </div>
    <div class="h-[400px] m-auto">
      <BarChart
        v-if="statisticTotalMessage.length > 0"
        :chart-data="getChartTotalMessageData"
        :chart-options="getOptionChartTotalMessage"
        :width="20"
        :height="20"
        :style="myStyles"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import BarChart from '~/components/BarChart.vue'
import LoaderSideConversation from '~/components/LoaderSideConversation.vue'
import { getConversationIndividualByEmail } from '~/api/conversation'
import { getAllMessageByIdConversation } from '~/api/message.api'

// Nuxt utilities
const { $t } = useI18n()

// Define middleware
definePageMeta({
  middleware: ['check-auth', 'auth-required'],
})

// Define page metadata
useHead({
  title: computed(() => $t('title.statistic')),
})

// Reactive state
const statisticTotalMessage = ref([])
const isShowLoader = ref(true)
const account = useState('account', () => null)

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

// Computed properties
const getChartTotalMessageData = computed(() => {
  if (statisticTotalMessage.value.length > 0) {
    const fullNameLabel = []
    const dataTotalMessage = []
    const dataAverageTimeReply = []
    const dataAverageMessagePerDay = []

    statisticTotalMessage.value.forEach((item) => {
      fullNameLabel.push(item.user.fullName)
      dataTotalMessage.push(item.totalMessage)
      dataAverageTimeReply.push((Math.random() * 10 + 5).toFixed(0))
      dataAverageMessagePerDay.push(
        (item.totalMessage / (Math.random() * 5 + 1).toFixed(0)).toFixed(2)
      )
    })

    return {
      labels: fullNameLabel,
      datasets: [
        {
          label: $t('chart.totalMessage'),
          data: dataTotalMessage,
          backgroundColor: '#ff7200',
        },
        {
          label: $t('chart.timeReply'),
          data: dataAverageTimeReply,
          backgroundColor: '#FBDF07',
        },
        {
          label: $t('chart.averageMessagePerDay'),
          data: dataAverageMessagePerDay,
          backgroundColor: '#89CFFD',
        },
      ],
    }
  }
  return null
})

const getOptionChartTotalMessage = computed(() => {
  const nameChart = $t('chart.chartTotalMessage')
  return {
    plugins: {
      title: {
        display: true,
        text: nameChart,
      },
    },
    ...chartOptions,
  }
})

const myStyles = computed(() => ({
  height: '500px',
  position: 'relative',
  margin: 'auto',
}))

// Fetch data on client-side mount
onMounted(async () => {
  try {
    const conversationOfCurrentUser = await getConversationIndividualByEmail(account.value)
    const statisticTotalMessageTemp = []

    for (const conversation of conversationOfCurrentUser) {
      const messagesOfConversation = await getAllMessageByIdConversation(conversation.id)
      statisticTotalMessageTemp.push({
        user: conversation.partnerUser,
        totalMessage: messagesOfConversation.length,
      })
    }

    statisticTotalMessage.value = statisticTotalMessageTemp
    isShowLoader.value = false
  } catch (error) {
    console.error('Error fetching conversation data:', error)
    isShowLoader.value = false
  }
})
</script>

<style></style>