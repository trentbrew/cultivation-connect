<script setup>
  const global = useGlobalStore()
  const route = useRoute()
  const router = useRouter()
  const pb = usePocketbase()

  const state = reactive({
    loading: false,
    context: '',
    series: [],
    data: null,
    records: null,
    latest_value: 0, // ie. 72
    avg: 0, // ie. 83.25
    min: 0, // ie. 35
    max: 0, // ie. 138
    range: null,
  })

  onMounted(async () => {
    if (hasDetailsHash.value) {
      state.context = route.hash.substring(1)
      state.range = global.getRange(route.hash.substring(1))
      await fetchCycle()
      await fetchRecords()
      console.log('state.data: ', state.data)
      console.log('state.range: ', state.range)
    }
  })

  const hasDetailsHash = computed(
    () =>
      route.hash &&
      route.hash.split('-')[0] != 'edit' &&
      !['records', 'upload-csv'].includes(route.hash.substring(1))
  )

  watch(
    () => route,
    newRoute => {
      state.loading = true
      state.data = null
      state.records = null
      if (hasDetailsHash.value) {
        state.context = newRoute.hash.substring(1)
        state.range = global.getRange(newRoute.hash.substring(1))
        setTimeout(async () => {
          await fetchCycle()
          await fetchRecords()
          state.loading = false
        }, 1200)
        console.log('state.data: ', state.data)
        console.log('state.range: ', state.range)
      }
    },
    { deep: true }
  )

  async function fetchCycle() {
    const cycle = await pb.get('cycles', {
      id: route.params.cycle,
    })
    state.data = cycle
  }

  async function fetchRecords() {
    console.log('fetching records')
    console.log(route.hash)
    const records = await pb.get('records', {
      filter: `cycle = "${route.params.cycle}" && facility.id = "${pb.api.authStore.model.facility}"`,
    })
    console.log(records)
    state.records = records.sort((a, b) => {
      return new Date(a.date_recorded) - new Date(b.date_recorded)
    })
    console.log(state.records)
    calculateMetrics(state.records)
  }

  function calculateMetrics(records) {
    const values = records.map(record => {
      if (record.data[state.context]) return record.data[state.context]
    })

    const initialize = datum => {
      if (datum) {
        const getPreviousDate = date => {
          const d = new Date(date)
          d.setDate(d.getDate() - 1)
          return d.toISOString().split('T')[0]
        }
        return [getPreviousDate(datum[0]), 0]
      }
    }

    state.avg =
      values.reduce((a, b) => Number(a) + Number(b), 0) / values.length
    state.min = Math.min(...values)
    state.max = Math.max(...values)

    let series = records.map(record => {
      if (record.data[state.context]) {
        return [record.date_recorded, record.data[state.context]]
      }
    })

    console.log(series)

    if (series.length < 2) {
      state.series = [initialize(series[0]), series[0]]
    } else {
      state.series = [
        series.map(item => {
          return [item[0].split(' ')[0], Number(item[1])]
        }),
      ]
    }
    state.latest_value = values[values.length - 1]
  }
</script>

<template>
  <div>
    <input type="checkbox" id="details" class="modal-toggle" />
    <label for="details" class="modal">
      <label for="" class="p-0 m-0">
        <div
          v-if="state.data && state.range && !state.loading"
          class="modal-box !border-base-200"
        >
          <div class="w-[83vw] h-[79vh]">
            <div class="w-full h-full">
              <div class="absolute ml-4">
                <div class="ml-4 text-2xl mt-6 font-bold">
                  {{ state.range?.title ?? '' }}
                </div>
              </div>
              <div v-if="route.hash" class="w-full h-full pt-24">
                <div class="w-full h-full p-4 flex gap-4">
                  <div
                    class="h-full w-fit flex flex-col gap-4 justify-between items-start rounded"
                  >
                    <span class="absolute m-2 mx-3">Last recorded</span>
                    <div
                      class="bg-base-100 border border-base-300 flex-grow flex justify-center items-center flex-col rounded-[8px]"
                    >
                      <div class="absolute">
                        <Pill
                          :id="state.context"
                          :value="Number(state.latest_value)"
                          :unit="state.range?.unit"
                          class="translate-y-28"
                        />
                      </div>
                      <div
                        class="w-96 h-[300px] flex justify-center items-center"
                      >
                        <Gauge
                          :context="state.context"
                          :value="Number(state.latest_value)"
                        />
                      </div>
                    </div>
                    <div class="h-fit w-96 flex flex-col gap-4">
                      <div
                        class="bg-base-100 border border-base-300 w-full h-32 rounded-[8px] p-2 px-3 flex flex-col justify-between items-start"
                      >
                        <span>Avg</span>
                        <h2 class="text-3xl mb-3 ml-3">
                          <span class="font-bold">
                            {{
                              state.range?.unit == '%'
                                ? Number.isInteger(state.avg * 100)
                                  ? state.avg * 100
                                  : (state.avg * 100).toFixed(2)
                                : Number.isInteger(state.avg)
                                ? state.avg
                                : state.avg.toFixed(2)
                            }}
                          </span>
                          <span class="text-sm ml-1">
                            {{ state.range.unit ?? '' }}
                          </span>
                        </h2>
                      </div>
                      <div class="flex gap-4 w-full">
                        <div
                          class="w-full h-32 bg-base-100 border border-base-300 rounded-[8px] p-2 px-3 flex flex-col justify-between items-start"
                        >
                          <span>Min</span>
                          <h2 class="text-3xl mb-3 ml-3">
                            <span class="font-bold">
                              {{
                                state.range?.unit == '%'
                                  ? Number.isInteger(state.min * 100)
                                    ? state.min * 100
                                    : (state.min * 100).toFixed(2)
                                  : Number.isInteger(state.min)
                                  ? state.min
                                  : state.min.toFixed(2)
                              }}
                            </span>
                            <span class="text-sm ml-1">
                              {{ state.range.unit ?? '' }}
                            </span>
                          </h2>
                        </div>
                        <div
                          class="w-full h-32 bg-base-100 border border-base-300 rounded-[8px] p-2 px-3 flex flex-col justify-between items-start"
                        >
                          <span>Max</span>
                          <h2 class="text-3xl mb-3 ml-3">
                            <span class="font-bold">
                              {{
                                state.range?.unit == '%'
                                  ? Number.isInteger(state.max * 100)
                                    ? state.max * 100
                                    : (state.max * 100).toFixed(2)
                                  : Number.isInteger(state.max)
                                  ? state.max
                                  : state.max.toFixed(2)
                              }}
                            </span>
                            <span class="text-sm ml-1">
                              {{ state.range?.unit }}
                            </span>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="w-full h-full border border-base-300 rounded p-4">
                    <LineGraph
                      :context="state.context"
                      :value="Number(state.latest_value)"
                      :series="state.series"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-action absolute top-0 right-6">
            <label
              @click="router.push({ hash: '' })"
              for="details"
              class="btn btn-ghost btn-circle"
            >
              <Icon name="close" />
            </label>
          </div>
        </div>
        <div v-else class="model-box !border-base-200">
          <Loading size="80" />
        </div>
      </label>
    </label>
  </div>
</template>
