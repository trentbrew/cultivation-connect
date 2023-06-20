<script setup>
  import utils from '@/helpers/utils'

  const pb = usePocketbase()
  const router = useRouter()
  const route = useRoute()
  const global = useGlobalStore()

  const state = reactive({
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
        title: 'Submit cycles',
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
    cycle: {
      active: false,
      id: '',
      name: '',
      latest_record: null,
      overview: {
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
          value: 0, // placeholder: 60
        },
      ],
    },
  })

  onMounted(async () => {
    state.loading = true
    router.push({ hash: '' })
    initCycle()
  })

  const csvStatus = computed(() => global.getCsvStatus)

  watch(
    () => csvStatus.value,
    val => {
      console.log('csvStatus', val)
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
    val => {
      if (
        !val.hash &&
        !['#edit-data', '#new-cycle', '#records', '#edit-cultivar'].includes(
          val.hash
        )
      ) {
        state.loading = true
        initCycle()
      }
    },
    { deep: true }
  )

  async function initCycle() {
    const cycle = await pb.get('cycles', {
      id: route.params.cycle,
    })
    if (cycle.active) {
      const { data: latest_record } = await pb.get('records', {
        id: cycle.latest_record,
      })
      state.cycle.conditions.forEach((item, index) => {
        if (latest_record[item.name]) {
          state.cycle.conditions[index].value = latest_record[item.name]
        }
      })
    }
    state.cycle.id = cycle.id
    state.cycle.name = cycle.name
    state.cycle.latest_record = cycle.latest_record
    state.cycle.overview.plants = cycle.plants
    state.cycle.overview.day = Math.floor(
      utils.timeDifference(Date.now(), Date.parse(cycle.start_date), 'd')
    )
    state.cycle.overview.growthPhase = utils.capitalize(cycle.growth_stage)
    state.cycle.overview.startDate = utils.dateString(cycle.start_date, 'short')
    // TODO: calculate est harvest date
    state.cycle.overview.estHarvestDate = utils.dateString(
      Date.parse(cycle.start_date) + 112 * 24 * 60 * 60 * 1000,
      'short'
    )
    state.cycle.active = cycle.active
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
    // this function adds any missing data to the report, like cultivar, room, etc
    const total_headers = [
      'start_date',
      'cultivar',
      'zone',
      'room',
      'growth_stage',
      'plants',
      'substrate',
      'nutrients_type',
      'root_zone_style',
    ]
    const report = state.csvStatus.report
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
      console.log(item)
      if (report[0][item] === '---') missing_headers.push(item)
    })
    state.missingCsvHeaders = missing_headers
    return missing_headers.length === 0
  })

  function handleGenerateCycles() {
    console.log('csvIsValid', csvIsValid.value)
    if (!csvIsValid.value) {
      global.toast(
        'default',
        `Missing required headers: ${state.missingCsvHeaders.join(
          ', '
        )}. Click the item to edit and try again.`
      )
    } else {
      console.log('generating cycles from csv')
      // TODO: prompt user for cultivar
      // TODO: create each new zone if it doesn't exist
      // TODO: parse the growth stages
      // TODO: create the cycle payloads
      // TODO: trigger loading page & upload the cycles to the db
    }
  }
</script>

<template>
  <AuthRouteGuard>
    <div class="w-full h-screen flex flex-col">
      <div class="w-full h-20 flex justify-between items-center p-4">
        <Path class="ml-4" page="Cycles" :cycle="state.cycle" />
        <div class="flex gap-2">
          <ModalTrigger
            @click="updateHash('records')"
            class="btn btn-outline gap-2 hover:bg-base-200 hover:text-base-content"
            target="cycle-records"
          >
            <Icon name="table" size="24" />
            <span class="text-base">View records</span>
          </ModalTrigger>
          <DrawerToggle
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
            <div class="stat">
              <div class="stat-title">Day</div>
              <div class="stat-value">
                {{ state.cycle.overview.day }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Plants</div>
              <div class="stat-value">
                {{ state.cycle.overview.plants }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Growth Phase</div>
              <div class="stat-value">
                {{ state.cycle.overview.growthPhase }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Start date</div>
              <div class="stat-value">
                {{ state.cycle.overview.startDate }}
              </div>
            </div>
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
          <div
            v-show="state.loading"
            class="w-full h-full flex justify-center items-center"
          >
            <Loading size="80" />
          </div>
          <ul
            v-if="state.cycle.active && !state.loading"
            class="w-full min-h-full grid grid-cols-4 overflow-scroll gap-4 p-4 pt-0"
          >
            <!-- TODO: Clamp the grid -->
            <li v-for="(item, index) in state.cycle.conditions" :key="index">
              <ModalTrigger
                @click="item.name != 'yield' ? updateHash(item.name) : () => {}"
                target="details"
              >
                <Stat
                  :id="item.name"
                  :title="item.title"
                  :value="Number(item.value)"
                  :disabled="item.name == 'yield'"
                />
              </ModalTrigger>
            </li>
          </ul>

          <div
            v-if="state.csvStatus.active && state.csvStatus.reviewing"
            class="w-full h-full p-8 pt-0"
          >
            <div class="w-full h-full" v-if="state.csvStatus.report">
              <h1 class="text-3xl mt-6 mb-4">
                {{ `${state.csvStatus.report.length} cycles found` }}
              </h1>
              <div class="flex justify-between items-end h-[60px]">
                <div class="opacity-75 mb-8">
                  <p>
                    <b>{{ state.csvStatus.entry_count ?? 0 }}</b>
                    total entries have been uploaded across
                    <b>{{ state.csvStatus.report.length }}</b>
                    cycles.
                    <br />
                  </p>
                </div>
                <div class="flex gap-2 my-8">
                  <button
                    @click="router.go(router.path)"
                    class="btn btn-outline"
                  >
                    Re-upload
                  </button>
                  <button
                    @click="handleGenerateCycles"
                    class="btn btn-primary"
                    :class="
                      !csvIsValid.value
                        ? 'btn-disabled !pointer-events-auto'
                        : ''
                    "
                  >
                    {{ `Submit ${state.csvStatus.report.length} cycles` }}
                  </button>
                </div>
              </div>
              <Table
                drawer
                :data="state.csvStatus.report"
                :missing="state.missingCsvHeaders"
                class="w-full h-fit max-h-[450px] border-none"
              />
              <!-- TODO: display overview: (total records, entries per zone, growth stage per zone) -->
              <!-- TODO: prompt for missing data: (cultivar, room) -->
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
              img="data"
              class="mb-8 w-[300px] -mt-12 brightness-[0.915] opacity-75"
            />

            <Loading
              v-if="state.csvStatus.active && !state.csvStatus.reviewing"
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
                @click="router.push({ hash: '#upload-csv' })"
                label="Upload grow data"
                class="btn-primary mt-12 w-fit"
                icon="upload"
                for="csv-upload"
              />
              <DrawerToggle
                @click="router.push({ hash: '#new-record' })"
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
        <div v-show="!state.cycle.active && !state.loading">
          <Stepper :steps="state.steps" class="mb-8" />
        </div>
      </div>
    </div>
  </AuthRouteGuard>
</template>

<style>
  .stat-title {
    @apply text-sm;
  }
  .stat-value {
    @apply text-xl font-bold;
  }
</style>
