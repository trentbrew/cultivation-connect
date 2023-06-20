<script setup>
  const global = useGlobalStore()
  const route = useRoute()
  const router = useRouter()
  const pb = usePocketbase()

  const state = reactive({
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

  onMounted(() => {
    fetchCycle()
    fetchRecords()
    if (route.hash) {
      state.context = route.hash.substring(1)
      state.range = global.getRange(route.hash.substring(1))
    }
  })

  const hasDetailsHash = computed(
    () =>
      route.hash &&
      route.hash.split('-')[0] != 'edit' &&
      !['records', 'upload-csv'].includes(route.hash.substring(1))
  )

  watch(
    () => route.hash,
    newHash => {
      if (hasDetailsHash.value) {
        state.context = newHash.substring(1)
        state.range = global.getRange(newHash.substring(1))
        fetchCycle()
        fetchRecords()
        calculateMetrics()
      }
    }
  )

  async function fetchCycle() {
    const cycle = await pb.get('cycles', {
      id: route.params.cycle,
    })
    state.data = cycle
  }

  async function fetchRecords() {
    if (hasDetailsHash.value) {
      console.log(route.hash)
      const records = await pb.get('records', {
        filter: `cycle = "${route.params.cycle}" && facility.id = "${pb.api.authStore.model.facility}"`,
      })
      state.records = records
      calculateMetrics()
    }
  }

  function calculateMetrics() {
    if (state.records) {
      const values = state.records.map(record => {
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
      state.avg = values.reduce((a, b) => a + b, 0) / values.length
      state.min = Math.min(...values)
      state.max = Math.max(...values)
      state.latest_value = values[values.length - 1]
      const series = state.records.map(record => {
        if (record.data[state.context]) {
          return [
            record.date_recorded.split(' ')[0],
            record.data[state.context],
          ]
        }
      })
      if (series.length < 2) {
        state.series = [initialize(series[0]), series[0]]
      } else {
        state.series = series
      }
    }
  }
</script>

<template>
  <div v-if="state.data && state.range">
    <input type="checkbox" id="details" class="modal-toggle" />
    <label for="details" class="modal">
      <label for="" class="p-0 m-0">
        <div class="modal-box !border-base-200">
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
                          <span>
                            {{
                              state.range?.unit == '%'
                                ? Number.isInteger(state.avg * 100)
                                  ? state.avg * 100
                                  : (state.avg * 100).toFixed(2)
                                : state.avg
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
                            <span>
                              {{
                                state.range?.unit == '%'
                                  ? Number.isInteger(state.min * 100)
                                    ? state.min * 100
                                    : (state.min * 100).toFixed(2)
                                  : state.min
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
                            <span>
                              {{
                                state.range?.unit == '%'
                                  ? Number.isInteger(state.max * 100)
                                    ? state.max * 100
                                    : (state.max * 100).toFixed(2)
                                  : state.max
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
      </label>
    </label>
  </div>
</template>
