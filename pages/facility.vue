<script setup>
  const pb = usePocketbase()
  const global = useGlobalStore()
  const router = useRouter()

  const state = reactive({
    loading: false,
    selectedRoom: 'rupkybclrltrbo4',
    data: {
      facility: null,
      rooms: null,
      zones: null,
      sensors: null,
      cultivars: null,
      cycles: null,
      series: [],
    },
  })

  function pbFetch(collection, options) {
    let data
    if (!options) {
      data = pb.get(collection, {
        filter: `facility.id = "${pb.api.authStore.model.facility}"`,
      })
    } else {
      data = pb.get(collection, options)
    }
    return data
  }

  onMounted(async () => {
    console.clear()
    const user = pb.api.authStore.model
    state.loading = true
    state.data.facility = await pbFetch('facilities', { id: user.facility })
    state.data.rooms = await pbFetch('rooms')
    state.data.zones = await pbFetch('zones')
    state.data.sensors = await pbFetch('sensors')
    state.data.cultivars = await pbFetch('cultivars')
    state.data.cycles = await pbFetch('cycles')
    state.data.records = await pbFetch('records')
    state.loading = false
    getCompundSeries()
  })

  const greet = computed(() => {
    const now = new Date()
    const hour = now.getHours()
    const name = pb.api.authStore.model.first_name
    if (hour < 12) return `Good morning, ${name}!`
    else if (hour < 18) return `Good afternoon, ${name}!`
    else return `Good evening, ${name}!`
  })

  function prettifyDate(dateString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }

    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', options)
  }

  async function getCompundSeries() {
    // step0: get all active cycles

    const cycleRooms = state.data.cycles
      .filter(cycle => cycle.active)
      .map(cycle => cycle.room)

    // console.log('cycle rooms: ', cycleRooms)

    // step1: get all unique rooms for the active cycles

    const uniqueCycleRooms = [...new Set(cycleRooms)]

    // console.log('unique cycle rooms: ', uniqueCycleRooms)

    // step2: get all records belonging to the unique rooms

    const records = state.data.records

    let uniqueCycleRoomRecords = uniqueCycleRooms.map(room => {
      return records.filter(record => record.room == room)
    })

    // console.log('unique cycle room records: ', uniqueCycleRoomRecords)

    // step3: get all unique dates from the records for each room

    const uniqueDates = uniqueCycleRoomRecords.map(room => {
      return [...new Set(room.map(record => record.date_recorded))]
    })

    // console.log('unique dates: ', uniqueDates)

    // step4: get all data entries belonging to each timestamp

    const recordsPerTimestamp = uniqueCycleRoomRecords.map(room => {
      return room.map(record => {
        return {
          date_recorded: record.date_recorded,
          data: record.data,
          room: record.room,
        }
      })
    })

    // console.log('records per timestamp: ', recordsPerTimestamp)

    // step5: instantiate series paayload

    const relevantRecords = recordsPerTimestamp.filter(
      room => room[0].room == state.selectedRoom
    )[0]

    // console.log('relevant records: ', relevantRecords)

    let series = {
      dateList: [],
      valueList: {
        air_humidity: [],
        air_temp: [],
        co2: [],
        day_time_dry_back: [],
        day_time_pore_ec: [],
        day_time_soil_moisture: [],
        dli: [],
        grow_medium_temp: [],
        night_time_dry_back: [],
        night_time_pore_ec: [],
        night_time_soil_moisture: [],
        ph: [],
        pore_ec: [],
        solar: [],
        vpd: [],
      },
    }

    series.dateList = relevantRecords.map(record =>
      prettifyDate(record.date_recorded)
    )

    series.valueList.air_humidity = relevantRecords.map((record, recordIndex) =>
      Number(record.data.air_humidity ?? 0)
    )
    series.valueList.air_temp = relevantRecords.map((record, recordIndex) =>
      Number(record.data.air_temp ?? 0)
    )
    series.valueList.co2 = relevantRecords.map((record, recordIndex) =>
      Number(record.data.co2 ?? 0)
    )
    series.valueList.day_time_dry_back = relevantRecords.map(
      (record, recordIndex) => Number(record.data.day_time_dry_back ?? 0)
    )
    series.valueList.day_time_pore_ec = relevantRecords.map(
      (record, recordIndex) => Number(record.data.day_time_pore_ec ?? 0)
    )
    series.valueList.day_time_soil_moisture = relevantRecords.map(
      (record, recordIndex) => Number(record.data.day_time_soil_moisture ?? 0)
    )
    series.valueList.dli = relevantRecords.map((record, recordIndex) =>
      Number(record.data.dli ?? 0)
    )
    series.valueList.grow_medium_temp = relevantRecords.map(
      (record, recordIndex) => Number(record.data.grow_medium_temp ?? 0)
    )
    series.valueList.night_time_dry_back = relevantRecords.map(
      (record, recordIndex) => Number(record.data.night_time_dry_back ?? 0)
    )
    series.valueList.night_time_pore_ec = relevantRecords.map(
      (record, recordIndex) => Number(record.data.night_time_pore_ec ?? 0)
    )
    series.valueList.night_time_soil_moisture = relevantRecords.map(
      (record, recordIndex) => Number(record.data.night_time_soil_moisture ?? 0)
    )
    series.valueList.ph = relevantRecords.map((record, recordIndex) =>
      Number(record.data.ph ?? 0)
    )
    series.valueList.pore_ec = relevantRecords.map((record, recordIndex) =>
      Number(record.data.pore_ec ?? 0)
    )
    series.valueList.solar = relevantRecords.map((record, recordIndex) =>
      Number(record.data.solar ?? 0)
    )
    series.valueList.vpd = relevantRecords.map((record, recordIndex) =>
      Number(record.data.vpd ?? 0)
    )

    state.series = series
  }
</script>

<template>
  <AuthRouteGuard>
    <div class="w-full h-screen flex flex-col">
      <div
        v-if="!state.loading"
        id="content"
        class="flex flex-col flex-grow w-full"
      >
        <div class="w-full flex justify-between items-start p-8">
          <div>
            <span class="text-lg">{{ greet }}</span>
            <h1 class="text-5xl mt-4">
              {{ state.data.facility?.company_name }}
            </h1>
          </div>
        </div>

        <header class="p-4">
          <div
            class="stats stats-horizontal rounded w-full border border-base-300"
          >
            <div class="stat">
              <div class="stat-title">Yield</div>
              <div class="stat-value">
                {{ 0 }}
                <span class="text-sm">g/sqft</span>
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Cycles</div>
              <div class="stat-value">
                {{ state.data.cycles?.length }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Active cycles</div>
              <div class="stat-value">
                {{ state.data.cycles?.filter(item => item.active).length }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Vital conditions</div>
              <div class="stat-value">
                {{ 0 }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Dire conditions</div>
              <div class="stat-value">
                {{ 0 }}
              </div>
            </div>
          </div>
        </header>

        <div class="w-full h-full p-4 pt-0">
          <div class="w-full h-full gap-4 flex flex-col">
            <div
              class="w-full h-full rounded-[8px] p-4 border-[1px] border-base-300"
            >
              <MultiLineGraph :series="state.series" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="w-full h-full flex justify-center items-center">
        <Loading size="60" />
      </div>
    </div>
  </AuthRouteGuard>
</template>
