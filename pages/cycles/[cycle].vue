<script setup>
  import utils from '@/helpers/utils'

  const pb = usePocketbase()
  const router = useRouter()
  const route = useRoute()
  const global = useGlobalStore()

  const state = reactive({
    collectionsActive: true,
    steps: [
      {
        title: 'Create cycle',
        name: 'create_cycle',
        status: 'complete',
      },
      {
        title: 'Upload data',
        name: 'import_data',
        status: 'active',
      },
      {
        title: 'Review data',
        name: 'review_data',
        status: 'incomplete',
      },
      {
        title: 'Submit',
        name: 'submit_data',
        status: 'incomplete',
      },
      {
        title: 'Initiate cycle',
        name: 'activate_cycle',
        status: 'incomplete',
      },
    ],
    loading: false,
    missingCsvHeaders: [],
    csvStatus: {},
    postingEntries: false,
    relevantData: {},
    cycle: {
      start_date: '',
      active: false,
      id: '',
      name: '',
      room: '',
      roomIndex: 0,
      zone: '',
      zoneIndex: 0,
      latest_record: null,
      cultivar: '',
      plants: 0,
      substrate: '',
      nutrients_type: '',
      root_zone_style: '',
      overview: {
        room: '',
        zone: '',
        latest: '',
        plants: 0,
        day: 0,
        growthPhase: '',
        startDate: '',
        estHarvestDate: '',
      },
      conditions: [
        {
          title: 'Air Temperature',
          name: 'air_temp',
          value: 0, // placeholder: 72
        },
        {
          title: 'Soil Temperature',
          name: 'grow_medium_temp',
          value: 0, // placeholder: 69
        },
        {
          title: 'Air Humidity',
          name: 'air_humidity',
          value: 0, // placeholder: 0.211
        },
        {
          title: 'Solar',
          name: 'solar',
          value: 0, // placeholder: 270
        },
        {
          title: 'Vapor Pressure Deficit',
          name: 'vpd',
          value: 0, // placeholder: 0.62
        },
        {
          title: 'Daylight Integral',
          name: 'dli',
          value: 0, // placeholder: 32.77
        },
        {
          title: 'CO2',
          name: 'co2',
          value: 0, // placeholder: 1205
        },
        {
          title: 'Pore EC',
          name: 'pore_ec',
          value: 0, // placeholder: 0.161
        },
        {
          title: 'Pore EC (Day)',
          name: 'day_time_pore_ec',
          value: 0, // placeholder: 0.112
        },
        {
          title: 'Pore EC (Night)',
          name: 'night_time_pore_ec',
          value: 0, // placeholder: 0.29
        },
        {
          title: 'Soil Moisture (Day)',
          name: 'day_time_soil_moisture',
          value: 0, // placeholder: 0.443
        },
        {
          title: 'Soil Moisture (Night)',
          name: 'night_time_soil_moisture',
          value: 0, // placeholder: 0.298
        },
        {
          title: 'Dry Back (Day)',
          name: 'day_time_dry_back',
          value: 0, // placeholder: 0.045
        },
        {
          title: 'Dry Back (Night)',
          name: 'night_time_dry_back',
          value: 0, // placeholder: 0.164
        },
        {
          title: 'Soil pH',
          name: 'ph',
          value: 0, // placeholder: 5.97
        },
        {
          title: 'Yield',
          name: 'yield',
          value: -1, // placeholder: 60
        },
      ],
    },
  })

  onMounted(async () => {
    router.push({ hash: '' })
    state.collectionsActive = global.getCollectionsActive
    await initCycle()
  })

  const collectionsActive = computed(() => global.getCollectionsActive)

  const csvStatus = computed(() => global.getCsvStatus)

  watch(
    () => collectionsActive.value,
    val => {
      state.collectionsActive = val
    },
    { deep: true }
  )

  watch(
    () => csvStatus.value,
    val => {
      state.csvStatus = val
      if (val.reviewing) {
        state.steps[1].status = 'complete'
        state.steps[2].status = 'active'
      }
      if (val.report) {
        validateReport()
      }
    },
    { deep: true }
  )

  watch(
    () => route,
    async val => {
      if (!route.hash) {
        state.loading = true
        setTimeout(() => {
          initCycle()
          state.loading = false
        }, 1200)
      }
    },
    { deep: true }
  )

  const formatDateTime = str => {
    const date = new Date(str)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const isToday = date.toDateString() === today.toDateString()
    const isYesterday = date.toDateString() === yesterday.toDateString()
    const month = date.toLocaleString('default', { month: 'long' })
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 || 12
    const formattedMinute = minute < 10 ? `0${minute}` : minute
    if (isToday) return `Today ${formattedHour}:${formattedMinute} ${ampm}`
    if (isYesterday)
      return `Yesterday ${formattedHour}:${formattedMinute} ${ampm}`
    return `${month} ${day} ${formattedHour}:${formattedMinute} ${ampm}`
  }

  async function initCycle() {
    state.loading = true

    const cycle = await pb.get('cycles', {
      id: route.params.cycle,
    })

    if (cycle) {
      state.cycle.id = cycle.id
      state.cycle.start_date = cycle.start_date
      state.cycle.name = cycle.name
      state.cycle.latest_record = cycle.latest_record
      state.cycle.cultivar = cycle.cultivar
      state.cycle.plants = cycle.plants
      state.cycle.substrate = cycle.substrate
      state.cycle.nutrients_type = cycle.nutrients_type
      state.cycle.growth_stage = cycle.growth_stage
      const room = await pb.get('rooms', {
        id: cycle.room,
      })
      state.cycle.roomIndex = room.index
      state.cycle.room = room.id
      state.cycle.overview.room = room.name
      const zone = await pb.get('zones', {
        id: cycle.zone,
      })
      state.cycle.zone = zone.id
      state.cycle.zoneIndex = zone.index
      state.cycle.overview.zone = zone.name
      state.cycle.overview.plants = cycle.plants
      state.cycle.overview.day = Math.floor(
        utils.timeDifference(Date.now(), Date.parse(cycle?.start_date), 'd')
      )
      state.cycle.overview.growthPhase = utils.capitalize(cycle.growth_stage)
      state.cycle.overview.startDate = utils.dateString(
        cycle.start_date,
        'short'
      )
      // TODO: calculate est harvest date
      state.cycle.overview.estHarvestDate = utils.dateString(
        Date.parse(cycle.start_date) + 112 * 24 * 60 * 60 * 1000,
        'short'
      )
      state.cycle.active = cycle.active
      if (cycle.active) {
        const latest_record = await pb.get('records', {
          id: cycle.latest_record,
        })
        state.cycle.overview.latest = formatDateTime(
          latest_record?.date_recorded
        )
        state.cycle.conditions.forEach((item, index) => {
          if (latest_record?.data[item.name]) {
            state.cycle.conditions[index].value = latest_record?.data[item.name]
          }
        })
        state.cycle.conditions.sort((a, b) => a.value - b.value)
        state.cycle.conditions.reverse()
      }
    }
    state.loading = false
  }

  function updateHash(hash) {
    router.push({
      hash: `#${hash}`,
    })
  }

  function handleCsvImportCancel() {
    state.csvStatus.cancelled = true
    setTimeout(() => {
      global.cancelCsvUpload()
    }, 3000)
  }

  function validateReport() {
    const total_headers = [
      'start_date',
      'zone',
      'growth_stage',
      'cultivar',
      'room',
      'plants',
      'substrate',
      'nutrients_type',
      'root_zone_style',
    ]
    const report = state.csvStatus.report

    let recordsPayload = {}

    report
      .filter(
        item => Number(item.zone.substring(4)) === state.cycle.zoneIndex
      )[0]
      .data.forEach(entry => {
        if (!recordsPayload[entry.timestamp]) {
          recordsPayload[entry.timestamp] = {}
        }
        recordsPayload[entry.timestamp][entry.name] = entry.value
      })

    state.relevantData = Object.keys(recordsPayload).map(key => {
      return {
        timestamp: key,
        data: recordsPayload[key],
      }
    })

    const headers = Object.keys(report[0])
    const missing_headers = total_headers.filter(
      item => !headers.includes(item)
    )

    total_headers.forEach(item => {
      if (missing_headers.includes(item)) {
        report.forEach(row => {
          row[item] = '---'
        })
      }
    })
  }

  const csvIsValid = computed(() => {
    // if the report is missing any of the required headers, it's not valid
    const report = state.csvStatus.report
    const headers = Object.keys(report[0])
    const missing_headers = []
    headers.forEach(item => {
      if (report[0][item] === '---') missing_headers.push(item)
    })
    state.missingCsvHeaders = missing_headers
    return missing_headers.length === 0
  })

  async function submitRecord(entry) {
    const date_recorded = entry.timestamp

    const timeOfDay = () => {
      const hour = new Date(date_recorded).getHours()
      if (hour >= 6 && hour < 18) return 'day'
      else return 'night'
    }

    const getCycleDay = () => {
      const start = new Date(state.cycle.start_date)
      const today = new Date()
      const diff = today - start
      const day = Math.floor(diff / (1000 * 60 * 60 * 24))
      return day
    }

    const getCycleWeek = () => {
      const start = new Date(state.cycle.start_date)
      const today = new Date()
      const diff = today - start
      const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7))
      return week
    }

    if (timeOfDay() == 'day') {
      if (entry.name?.includes('pore_ec')) {
        data.pore_ec = entry.value
        data.day_time_pore_ec = entry.value
      } else if (entry.name?.includes('soil_moisture')) {
        data.day_time_soil_moisture = entry.value
      } else if (entry.name?.includes('dry_back')) {
        data.day_time_dry_back = entry.value
      }
    } else {
      if (entry.name?.includes('pore_ec')) {
        data.pore_ec = entry.value
        data.night_time_pore_ec = entry.value
      } else if (entry.name?.includes('soil_moisture')) {
        data.night_time_soil_moisture = entry.value
      } else if (entry.name?.includes('dry_back')) {
        data.night_time_dry_back = entry.value
      }
    }

    const payload = {
      date_recorded,
      recorded_by: pb.api.authStore.model.id,
      facility: pb.api.authStore.model.facility,
      room: state.cycle.room,
      zone: entry.zone ?? state.cycle.zone,
      cycle: state.cycle.id,
      cultivar: state.cycle.cultivar,
      growth_stage: entry.growth_stage ?? state.cycle.growth_stage,
      cycle_day: await getCycleDay(),
      cycle_week: await getCycleWeek(),
      data: JSON.stringify(entry.data),
    }

    const latest_record = await pb.post('records', payload).then(res => {
      console.log('entry submitted: ', res)
      console.log('res: ', res)
      return res.id
    })

    console.log('latest_record: ', latest_record)

    await pb.update('cycles', state.cycle.id, {
      active: true,
      latest_record,
    })
  }

  async function handleBatchEntryPost() {
    state.postingEntries = true
    setTimeout(() => {
      let latest = ''
      try {
        state.relevantData.slice(0, 10).forEach(async (entry, entryIndex) => {
          // console.log(`\nsubmitting entry #${entryIndex}...`)
          await submitRecord(entry)
        })
        global.toast(
          'primary',
          `Successfully submitted ${state.relevantData?.length} entries 🎉`
        )
        setTimeout(() => {
          location.reload()
        }, 1000)
      } catch {
        global.toast('error', 'Something went wrong 😢')
      }
    }, 1000)
  }
</script>

<template>
  <AuthRouteGuard>
    <div class="w-full h-screen flex flex-col">
      <div class="w-full h-20 flex justify-between items-center p-4">
        <Path class="ml-4" page="Cycles" :cycle="state.cycle" />
        <div class="flex gap-4">
          <ModalTrigger
            @click="updateHash('records')"
            class="btn btn-outline gap-2 hover:bg-base-200 hover:text-base-content"
            target="cycle-records"
          >
            <Icon name="table" size="24" />
            <span class="text-base">View records</span>
          </ModalTrigger>
          <DrawerToggle
            @click="updateHash('new-record')"
            v-if="state.cycle.active"
            class="bg-black"
            label="New record"
            icon="plus"
            for="new-record"
          />
        </div>
      </div>
      <div id="content" class="flex flex-col flex-grow">
        <header class="p-4 pt-0">
          <div
            class="stats stats-horizontal rounded w-full border border-base-300"
          >
            <div v-if="state.cycle.overview.latest" class="stat">
              <div class="stat-title">Latest record</div>
              <div class="stat-value">
                {{ state.cycle.overview.latest }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Plants</div>
              <div class="stat-value">
                {{ state.cycle.overview.plants }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Day</div>
              <div class="stat-value">
                {{ state.cycle.overview.day }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Growth phase</div>
              <div class="stat-value">
                {{
                  state.relevantData.growth_stage ??
                  state.cycle.overview.growthPhase
                }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Room</div>
              <div class="stat-value">
                {{ state.cycle.overview.room }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Zone</div>
              <div class="stat-value">
                {{ state.relevantData.zone ?? state.cycle.overview.zone }}
              </div>
            </div>
            <!-- <div class="stat">
              <div class="stat-title">Start date</div>
              <div class="stat-value">
                {{ state.cycle.overview.startDate }}
              </div>
            </div> -->
            <div class="stat">
              <div class="stat-title">Est. Harvest date</div>
              <div class="stat-value">
                {{ state.cycle.overview.estHarvestDate }}
              </div>
            </div>
          </div>
        </header>

        <div
          class="w-full h-full"
          :class="'flex flex-col justify-center items-center'"
        >
          <ul
            v-show="state.loading && !state.csvStatus.reviewing"
            class="w-full h-full flex justify-center items-center"
            style="animation: enter 0.5s ease-in-out forwards"
          >
            <ul
              class="w-full min-h-full grid grid-cols-4 overflow-scroll gap-4 p-4 pt-0 opacity-50"
            >
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
              <li
                class="bg-base-200 animate-pulse rounded-[8px] w-full h-full"
              ></li>
            </ul>
          </ul>
          <ul
            v-if="state.cycle.active && !state.loading"
            class="w-full min-h-full grid grid-cols-4 overflow-scroll gap-4 p-4 pt-0"
          >
            <!-- TODO: Clamp the grid -->
            <li v-for="(item, index) in state.cycle.conditions" :key="index">
              <ModalTrigger
                @click="item.name != 'yield' ? updateHash(item.name) : () => {}"
                target="details"
                class="h-max"
                :class="!item.value ? 'pointer-events-none' : ''"
              >
                <Stat
                  class=""
                  :id="item.name"
                  :title="item.title"
                  :value="item.value"
                  :disabled="item.name == 'yield' || !item.value"
                />
              </ModalTrigger>
            </li>
          </ul>

          <div
            v-if="state.csvStatus.active && state.csvStatus.reviewing"
            class="w-full h-full p-8 pt-0"
          >
            <div class="w-full h-full" v-if="state.csvStatus.report">
              <div>
                <h1 class="text-3xl mt-6 mb-4">
                  {{
                    `${
                      state.relevantData?.length.toLocaleString() ?? 0
                    } entries found for this zone`
                  }}
                </h1>
                <div class="opacity-75 mb-8">
                  <p>
                    Showing
                    <b>
                      {{
                        state.relevantData?.length > 50
                          ? 50
                          : state.relevantData?.length - 1
                      }}
                    </b>
                    out of
                    <b>{{ state.relevantData?.length.toLocaleString() }}</b>
                    total records
                    <br />
                  </p>
                </div>
                <div class="flex gap-2 my-8">
                  <button
                    @click="handleBatchEntryPost"
                    class="btn btn-primary flex gap-3 px-4"
                    :class="
                      state.postingEntries
                        ? 'btn-disabled pointer-events-none'
                        : ''
                    "
                  >
                    <Icon v-if="!state.postingEntries" name="upload" />
                    <Loading v-else />
                    {{
                      state.postingEntries
                        ? `Submitting entries...`
                        : `Submit ${state.relevantData?.length.toLocaleString()} entries`
                    }}
                  </button>
                  <button
                    @click="router.go(router.path)"
                    class="btn btn-outline flex gap-3 px-4"
                  >
                    <Icon name="refresh" />
                    Re-upload
                  </button>
                </div>
              </div>
              <!-- TODO: show all entries for this zone. If something doesn't look right, the user will have to adjust the CSV themselves -->
              <Table
                drawer
                :data="
                  state.relevantData
                    .map(item => {
                      let entry = {}
                      Object.entries(item.data).forEach(i => {
                        entry[i[0]] = i[1]
                      })
                      return {
                        timestamp: item.timestamp,
                        ...entry,
                      }
                    })
                    .slice(
                      0,
                      state.relevantData?.length > 50
                        ? 50
                        : state.relevantData?.length - 1
                    )
                "
                class="w-full h-full border-none"
              />
            </div>
            <div
              v-else
              class="w-full h-full flex flex-col justify-center items-center"
            >
              <Loading size="80" />
              <h1 class="text-center font-bold my-12 w-full">
                Generating report...
              </h1>
            </div>
          </div>

          <div
            v-show="
              !state.cycle.active && !state.loading && !state.csvStatus.done
            "
            class="flex flex-col justify-center items-center"
          >
            <WIP
              v-if="!state.csvStatus.active"
              img="growth"
              class="mb-16 -translate-x-8 w-[220px] -mt-36 brightness-[0.915] opacity-75"
            />

            <Loading
              v-if="
                (state.csvStatus.active && !state.csvStatus.reviewing) ||
                state.csvStatus.posting
              "
              size="80"
            />

            <h1
              v-if="!state.csvStatus.active"
              class="text-center opacity-50 w-full"
            >
              You haven't imported any data for this cycle yet. Get started by
              uploading
              <br />
              a
              <b>CSV File</b>
              , or filling in your data manually.
            </h1>

            <h1
              v-if="
                state.csvStatus.active &&
                !state.csvStatus.reviewing &&
                !state.csvStatus.report
              "
              class="text-center font-bold w-full my-12"
            >
              <span>{{ state.csvStatus.message }}</span>
            </h1>

            <div v-if="!state.csvStatus.active" class="flex gap-2">
              <DrawerToggle
                @click="updateHash('upload-csv')"
                label="Upload grow data"
                class="btn-primary mt-12 w-fit"
                icon="upload"
                for="csv-upload"
              />
              <DrawerToggle
                @click="updateHash('new-record')"
                label="Manually enter data"
                class="bg-black mt-12 w-fit"
                icon="plus"
                for="new-record"
              />
            </div>
            <div
              v-show="state.csvStatus.active && !state.csvStatus.reviewing"
              class="flex gap-2"
            >
              <button
                @click="handleCsvImportCancel"
                class="btn btn-outline"
                :disabled="state.csvStatus.cancelled"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div
          class="z-40 fixed bottom-0 h-[140px] w-full bg-base-100"
          v-show="
            (!state.cycle.active && !state.loading) || state.csvStatus.reviewing
          "
        ></div>
        <div
          class="z-40 fixed bottom-[140px] h-[80px] w-full"
          style="background: linear-gradient(transparent, hsl(var(--b1)))"
          v-show="
            (!state.cycle.active && !state.loading) || state.csvStatus.reviewing
          "
        ></div>
        <div class="w-full flex justify-center">
          <div
            class="w-[60vw] py-8 z-50 fixed bottom-0 flex justify-center items-center"
            v-show="
              (!state.cycle.active && !state.loading) ||
              state.csvStatus.reviewing
            "
          >
            <Stepper :steps="state.steps" class="w-full" />
          </div>
        </div>
      </div>
    </div>
  </AuthRouteGuard>
</template>

<style>
  @keyframes enter {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .stat-title {
    @apply text-sm;
  }
  .stat-value {
    @apply text-xl font-bold;
  }
</style>
