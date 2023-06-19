<script setup>
  import utils from '@/helpers/utils'

  const global = useGlobalStore()
  const pb = usePocketbase()
  const route = useRoute()
  const router = useRouter()

  const state = reactive({
    cycle: {
      id: null,
      name: null,
      room: null,
      zone: null,
      cultivar: null,
      growth_stage: null,
      start_date: null,
      csv: {
        selected: false,
        valid: false,
        init: {
          value: 'manual',
          valid: true,
        },
        origin: {
          value: null,
          valid: false,
        },
        files: null,
      },
    },
    patch: {
      cultivar: {
        name: '',
        phenotype: '',
        acquisition: '',
        notes: '',
      },
      sensor: {
        type: '',
        brand: '',
        name: '',
        condition: '',
      },
    },
    payload: {
      valid: false,
      sensor: {
        data_logging_capabilities: {
          value: 'manual_logging',
          valid: true,
        },
        type: {
          value: null,
          valid: false,
        },
        brand: {
          value: null,
          valid: false,
        },
        name: {
          value: null,
          valid: false,
        },
        condition: {
          value: null,
          valid: false,
        },
        calibration_date: {
          value: null,
          valid: false,
        },
        data_logging_frequency: {
          value: null,
          valid: false,
        },
      },
      cultivar: {
        name: {
          value: null,
          valid: false,
        },
        phenotype: {
          value: null,
          valid: false,
        },
        acquisition: {
          value: null,
          valid: false,
        },
        notes: {
          value: null,
          valid: true,
        },
      },
      cycle: {
        start_date: {
          value: null,
          valid: true,
        },
        cultivar: {
          value: null,
          valid: false,
        },
        room: {
          value: null,
          valid: false,
        },
        zone: {
          value: null,
          valid: false,
        },
        plants: {
          value: null,
          valid: false,
        },
        substrate: {
          value: null,
          valid: false,
        },
        root_zone_style: {
          value: null,
          valid: false,
        },
        nutrients_type: {
          value: null,
          valid: false,
        },
      },
      record: [
        {
          label: 'Air Temperature',
          name: 'air_temp',
          value: null,
        },
        {
          label: 'Soil Temperature',
          name: 'grow_medium_temp',
          value: null,
        },
        {
          label: 'Air Humidity',
          name: 'air_humidity',
          value: null,
        },
        {
          label: 'Solar',
          name: 'solar',
          value: null,
        },
        {
          label: 'Vapor Pressure Deficit',
          name: 'vpd',
          value: null,
        },
        {
          label: 'Daylight Integral',
          name: 'dli',
          value: null,
        },
        {
          label: 'CO2',
          name: 'co2',
          value: null,
        },
        {
          label: 'Pore EC',
          name: 'pore_ec',
          value: null,
        },
        {
          label: 'Pore EC (Day)',
          name: 'day_time_pore_ec',
          value: null,
        },
        {
          label: 'Pore EC (Night)',
          name: 'night_time_pore_ec',
          value: null,
        },
        {
          label: 'Soil Moisture (Day)',
          name: 'day_time_soil_moisture',
          value: null,
        },
        {
          label: 'Soil Moisture (Night)',
          name: 'night_time_soil_moisture',
          value: null,
        },
        {
          label: 'Dry Back (Day)',
          name: 'day_time_dry_back',
          value: null,
        },
        {
          label: 'Dry Back (Night)',
          name: 'night_time_dry_back',
          value: null,
        },
        {
          label: 'Soil pH',
          name: 'ph',
          value: null,
        },
      ],
    },
    data: {
      cultivars: [],
      sensors: [],
      cycles: [],
      rooms: [],
      zones: [],
    },
    context: {
      cultivar: null,
      sensor: null,
    },
  })

  onMounted(async () => {
    fetchData()
  })

  const valid = computed(() => {
    if (state.payload.valid || state.cycle.csv.valid) return true
    return false
  })

  const drawerContext = computed(() => global.getDrawerContext)

  const title = computed(() => {
    if (drawerContext.value == 'csv-upload') return 'Import Grow Data'
    if (drawerContext.value == 'new-cultivar') return 'Add a new cultivar'
    if (drawerContext.value == 'edit-cultivar') return `Edit cultivar`
    if (drawerContext.value == 'new-sensor') return 'Add a new sensor'
    if (drawerContext.value == 'edit-sensor') return 'Edit sensor'
    if (drawerContext.value == 'new-cycle') return 'Create a new cycle'
    if (drawerContext.value == 'new-record')
      return `New record (${new Date()
        .toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(',', '')})`
  })

  watch(
    () => route.hash,
    async newHash => {
      if (drawerContext.value == 'csv-upload') {
        state.cycle.csv.init = 'csv'
      } else if (
        drawerContext.value == 'new-cycle' ||
        newHash == '#new-cycle'
      ) {
        state.cycle.csv.init = 'manual'
      }
      if (
        newHash &&
        ['edit-cultivar', 'edit-sensor'].includes(drawerContext.value)
      ) {
        const cycle_id = newHash.substring(1).split('–')[1]
        console.log('auto-populating patch data')
        if (drawerContext.value == 'edit-cultivar') {
          const cycle = await state.data.cycles.filter(cycles => {
            return cycles.id == cycle_id
          })[0]
          const cultivar_id = cycle?.cultivar[0]
          const cultivar = await state.data?.cultivars.filter(
            cultivar => cultivar.id == cultivar_id
          )[0]
          console.log('state.data.cultivars: ', state.data.cultivars)
          console.log('cultivar_id: ', cultivar_id)
          console.log('cultivar: ', cultivar)
          if (cultivar) {
            state.context.cultivar = cultivar
            state.patch.cultivar.name = state.context.cultivar.name
            state.patch.cultivar.phenotype = state.context.cultivar.phenotype
            state.patch.cultivar.acquisition =
              state.context.cultivar.acquisition
            state.patch.cultivar.notes = state.context.cultivar.notes
            console.log('state.patch: ', state.patch.cultivar)
          }
        }
        if (drawerContext.value == 'edit-sensor') {
          // TODO: auto-populate sensor patch data
          console.log('auto-populating sensor patch data')
        }
      } else {
        state.context.cultivar = null
        state.context.sensor = null
        state.patch.cultivar.name = ''
        state.patch.cultivar.phenotype = ''
        state.patch.cultivar.acquisition = ''
        state.patch.cultivar.notes = ''
        state.patch.sensor.type = ''
        state.patch.sensor.brand = ''
        state.patch.sensor.name = ''
        state.patch.sensor.condition = ''
      }
      fetchData()
    }
  )

  async function fetchData() {
    state.cycle
    state.data.cultivars = await pbFetch('cultivars')
    state.data.sensors = await pbFetch('sensors')
    state.data.rooms = await pbFetch('rooms')
    state.data.zones = await pbFetch('zones')
    state.data.cycles = await pbFetch('cycles')
    const cycle_id = route.params.cycle
    const cycle = await state.data.cycles.filter(cycles => {
      return cycles.id == cycle_id
    })[0]
    state.cycle.id = cycle_id
    state.cycle.name = cycle?.name
    state.cycle.room = cycle?.room
    state.cycle.zone = cycle?.zone
    state.cycle.cultivar = cycle?.cultivar[0]
    state.cycle.growth_stage = cycle?.growth_stage
    state.cycle.start_date = cycle?.start_date
  }

  function handleFileInput() {
    console.log('file has been input')
    state.cycle.csv.selected = true
  }

  function handleCsvValidation(e) {
    state.cycle.csv.valid =
      state.cycle.csv.origin.value && state.cycle.csv.files?.length > 0
  }

  function handleValidation(e) {
    state['payload'][e.group][e.id].valid = e.valid
    const groupValidity = Object.values(state['payload'][e.group]).map(
      item => item.valid
    )
    state['payload'].valid = !groupValidity.includes(false)
  }

  async function pbFetch(collection) {
    if (collection == 'zones') {
      const zones = await pb.get(collection, {
        filter: `room = "${state.payload.cycle.room.value}" && facility.id = "${pb.api.authStore.model.facility}"`,
      })
      return zones
    }
    const data = await pb.get(collection, {
      filter: `facility.id = "${pb.api.authStore.model.facility}"`,
    })
    return data
  }

  function clearForm(group, validity) {
    Object.entries(state.payload[group]).forEach(([key, value]) => {
      state.payload[group][key].value = null
      state.payload[group][key].valid = validity ?? false
    })
  }

  async function handleAddItem(e) {
    if (e.id == 'room') {
      console.log('handling room addition', e)
      submitRoom(e.value)
    }
    if (e.id == 'zone') {
      console.log(`adding zone "${e.value}" to room "${e.room}"`)
      submitZone(e.value)
    }
  }

  async function handleRoomChange(e) {
    state.payload.cycle.zone.value = ''
    state.data.zones = await pbFetch('zones')
  }

  function handleSubmit() {
    if (drawerContext.value == 'new-sensor') submitSensor()
    if (drawerContext.value == 'new-cultivar') submitCultivar()
    if (drawerContext.value == 'edit-cultivar') updateCultivar()
    if (drawerContext.value == 'new-cycle') submitCycle()
    if (drawerContext.value == 'csv-upload') submitCsv()
    if (drawerContext.value == 'new-record') submitRecord()
    router.push({ hash: '' })
  }

  async function submitRecord() {
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
    const data = {
      air_temp: state.payload.record[0].value,
      grow_medium_temp: state.payload.record[1].value,
      air_humidity: state.payload.record[2].value,
      solar: state.payload.record[3].value,
      vpd: state.payload.record[4].value,
      dli: state.payload.record[5].value,
      co2: state.payload.record[6].value,
      pore_ec: state.payload.record[7].value,
      day_time_pore_ec: state.payload.record[8].value,
      night_time_pore_ec: state.payload.record[9].value,
      day_time_soil_moisture: state.payload.record[10].value,
      night_time_soil_moisture: state.payload.record[11].value,
      day_time_dry_back: state.payload.record[12].value,
      night_time_dry_back: state.payload.record[13].value,
      ph: state.payload.record[14].value,
      yield: null, // TODO: calulate this?
      thc: null, // TODO: get this from the cultivar?
      tac: null, // TODO: get this from the cultivar?
      terp: null, // TODO: get this from the cultivar?
    }
    const payload = {
      date_recorded: new Date().toISOString(),
      recorded_by: pb.api.authStore.model.id,
      facility: pb.api.authStore.model.facility,
      room: state.cycle.room,
      zone: state.cycle.zone,
      cycle: state.cycle.id,
      cultivar: state.cycle.cultivar,
      growth_stage: state.cycle.growth_stage,
      cycle_day: getCycleDay(),
      cycle_week: getCycleWeek(),
      data: JSON.stringify(data),
    }
    clearForm('record', true)
    pb.post('records', payload)
      .then(res => {
        const latest_record = res.id
        pb.update('cycles', state.cycle.id, {
          active: true,
          latest_record,
        }).then(() => {
          global.toast('default', 'Successfully submitted record')
        })
      })
      .catch(err => {
        global.toast('error', 'Error submitting record')
        console.log('error submitting record: ', err)
      })
  }

  async function submitCsv() {
    // handle readfile on the server

    const file = state.cycle.csv.files[0]
    const blob = new Blob([file], { type: 'text/csv' })

    if (state.cycle.csv.origin.value == 'aroya') {
      console.clear()
      global.beginCsvImport()

      const formData = new FormData()
      formData.append('file', blob)

      try {
        const response = await fetch('/api/v1/parse-csv', {
          method: 'POST',
          body: formData,
        })
        if (response.ok) {
          const reader = response.body.getReader()
          const decoder = new TextDecoder('utf-8')

          let parsed = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            parsed += decoder.decode(value)
          }

          const parsedData = JSON.parse(parsed)
          console.log('done parsing: ', parsedData)

          global.handleCsvUploaded(parsedData.data[0].entries.length)

          // TODO: pb.post the parsed data
          setTimeout(() => {
            global.completeCsvImport()
          }, 8000)
        } else {
          console.log('yikes...', response)
          global.toast('error', 'Error uploading CSV')
        }
      } catch (err) {
        console.log('error uploading csv: ', err)
        global.toast('error', 'Error uploading CSV')
      }
    } else {
      global.toast('error', 'Only Aroya CSVs are supported at this time')
    }
  }

  function triggerDataReview() {
    console.log('triggering data review process')
  }

  function submitSensor() {
    let payload = {
      facility: pb.api.authStore.model.facility,
    }
    Object.keys(state.payload.sensor).forEach(key => {
      if (key != 'valid') payload[key] = state.payload.sensor[key].value
    })
    clearForm('sensor')
    pb.post('sensors', payload).then(res => {
      console.log('✅ Added sensor', res)
      global.toast('default', 'Successfully added sensor')
      global.updateCache('sensors', res)
    })
  }

  function submitCultivar() {
    let payload = {
      facility: pb.api.authStore.model.facility,
    }
    Object.keys(state.payload.cultivar).forEach(key => {
      if (key != 'valid') payload[key] = state.payload.cultivar[key].value
    })
    clearForm('cultivar')
    pb.post('cultivars', payload).then(res => {
      global.toast('default', 'Successfully added cultivar')
      global.updateCache('cultivars', res)
    })
  }

  async function updateCultivar() {
    let payload = {}
    Object.keys(state.patch.cultivar).forEach(key => {
      if (state.patch.cultivar[key]) {
        console.log(state.patch.cultivar[key])
        payload[key] = state.patch.cultivar[key]
      }
    })
    clearForm('cultivar')
    pb.update('cultivars', state.context.cultivar.id, payload).then(res => {
      global.toast('default', 'Successfully updated cultivar')
      fetchData()
    })
  }

  async function getCultivarName() {
    let name = await pb.get('cultivars', {
      filter: `id = "${state.payload.cycle.cultivar.value}"`,
    })
    return name[0].name
  }

  async function submitCycle() {
    let payload = {
      name: `${state.payload.cycle.start_date.value}_${(
        await getCultivarName()
      ).replaceAll(' ', '-')}`,
      growth_stage: 'Propogation',
      facility: pb.api.authStore.model.facility,
    }
    Object.keys(state.payload.cycle).forEach(key => {
      if (key != 'valid') payload[key] = state.payload.cycle[key].value
    })
    clearForm('cycle')
    console.log('submitting cycle...', payload)
    pb.post('cycles', payload)
      .then(res => {
        console.log('✅ Added cycle', res)
        global.toast('default', 'Your new cycle has been created! 🙌')
        router.push(`/cycles/${res.id}`)
      })
      .catch(err => {
        console.log('something went wrong...', err)
        global.toast('error', 'Something went wrong. Please try again.')
      })
  }

  function submitRoom(name) {
    let payload = {
      name,
      facility: pb.api.authStore.model.facility,
    }
    pb.post('rooms', payload).then(res => {
      console.log('✅ Added room', res)
      global.toast('primary', `New room was successfully added!`)
      fetchData()
    })
  }

  function submitZone(name) {
    let payload = {
      name,
      room: state.payload.cycle.room.value,
      facility: pb.api.authStore.model.facility,
    }
    console.log('posting zone...', payload)
    pb.post('zones', payload).then(res => {
      console.log('✅ Added zone', res)
      global.toast('primary', 'New zone was successfully added!')
      fetchData()
    })
  }
</script>

<template>
  <div class="w-[40vw] bg-base-100 text-base-content border-l border-base-300">
    <h1 class="text-lg font-bold ml-8 h-[80px] flex justify-start items-center">
      {{ title }}
    </h1>

    <div
      class="max-h-[calc(100vh-160px)] border-t border-base-300 w-full overflow-auto pb-4"
    >
      <!-- NEW SENSOR -->

      <form
        v-if="drawerContext == 'new-sensor'"
        class="flex flex-col p-8 w-full"
      >
        <div class="form-control flex flex-col justify-start gap-4 mt-4 mb-8">
          <Input
            group="sensor"
            label="I record my own readings manually"
            type="radio"
            name="data_logging_capabilities"
            id="auto_logging"
            value="auto_logging"
            v-model="state.payload.sensor.data_logging_capabilities.value"
            checked
          />
          <Input
            group="sensor"
            label="I use software to record my readings automatically"
            type="radio"
            name="data_logging_capabilities"
            id="manual_logging"
            value="manual_logging"
            v-model="state.payload.sensor.data_logging_capabilities.value"
          />
        </div>

        <Input
          group="sensor"
          v-model="state.payload.sensor.type.value"
          type="select"
          label="Type"
          id="type"
          name="type"
          rules="required"
          @validation="handleValidation"
          class="w-full"
        >
          <option value="air_thermometer">Air thermometer</option>
          <option value="ir_thermometer">IR thermometer</option>
          <option value="soil_thermometer">Soil thermometer</option>
          <option value="ph_sensor">PH Sensor</option>
          <option value="soil_moisture_sensor">Soil moisture sensor</option>
          <option value="ec_ppm_sensor">EC/PPM sensor</option>
          <option value="feed_irrigation_thermometer">
            Feed/Irrigation thermometer
          </option>
        </Input>

        <Input
          group="sensor"
          v-model="state.payload.sensor.brand.value"
          type="text"
          label="Brand"
          id="brand"
          name="brand"
          rules="required"
          @validation="handleValidation"
          class="w-full"
        />

        <Input
          group="sensor"
          v-model="state.payload.sensor.name.value"
          type="text"
          id="name"
          name="name"
          label="Sensor name"
          rules="required"
          @validation="handleValidation"
          class="w-full"
        />

        <Input
          group="sensor"
          v-model="state.payload.sensor.condition.value"
          type="select"
          id="condition"
          name="condition"
          label="Condition"
          rules="required"
          @validation="handleValidation"
          class="w-full"
        >
          <option value="new">New</option>
          <option value="great">Like new</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </Input>

        <Input
          group="sensor"
          v-model="state.payload.sensor.calibration_date.value"
          type="date"
          label="Last calibrated"
          id="calibration_date"
          name="calibration_date"
          rules="required"
          @validation="handleValidation"
          class="w-full"
        />

        <Input
          group="sensor"
          v-model="state.payload.sensor.data_logging_frequency.value"
          type="select"
          id="data_logging_frequency"
          name="data_logging_frequency"
          label="Data logging frequency"
          rules="required"
          @validation="handleValidation"
          class="w-full"
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="other">Other</option>
        </Input>
      </form>

      <!-- NEW CULTIVAR -->

      <form v-if="drawerContext == 'new-cultivar'" class="flex flex-col p-8">
        <Input
          group="cultivar"
          v-model="state.payload.cultivar.name.value"
          type="text"
          id="name"
          name="name"
          label="Name"
          rules="required"
          @validation="handleValidation"
          class="w-full"
        />

        <Input
          group="cultivar"
          v-model="state.payload.cultivar.phenotype.value"
          type="select"
          id="phenotype"
          name="phenotype"
          label="Phenotype"
          rules="required"
          @validation="handleValidation"
          class="w-full"
        >
          <option value="indica">Indica</option>
          <option value="sativa">Sativa</option>
          <option value="hybrid_indica">Hybrid (Indica dominant)</option>
          <option value="hybrid_sativa">Hybrid (Sativa dominant)</option>
          <option value="hybrid_balanced">Hybrid (50/50)</option>
          <option value="unknown">Unknown</option>
        </Input>

        <Input
          group="cultivar"
          v-model="state.payload.cultivar.acquisition.value"
          type="select"
          id="acquisition"
          name="acquisition"
          label="Genetic acquisition"
          rules="required"
          @validation="handleValidation"
          class="w-full"
        >
          <option value="seeds">Seeds</option>
          <option value="clone">Clone</option>
        </Input>

        <Input
          group="cultivar"
          v-model="state.payload.cultivar.notes.value"
          type="textarea"
          id="notes"
          name="notes"
          label="Notes"
          class="w-full"
        />
      </form>

      <!-- EDIT CULTIVAR -->

      <form v-if="drawerContext == 'edit-cultivar'" class="flex flex-col p-8">
        <Input
          group="cultivar"
          v-model="state.patch.cultivar.name"
          :placeholder="state.patch.cultivar.name"
          type="text"
          id="name"
          name="name"
          label="Name"
          class="w-full"
        />

        <Input
          group="cultivar"
          v-model="state.patch.cultivar.phenotype"
          :placeholder="state.patch.cultivar.phenotype"
          type="select"
          id="phenotype"
          name="phenotype"
          label="Phenotype"
          class="w-full"
        >
          <option value="indica">Indica</option>
          <option value="sativa">Sativa</option>
          <option value="hybrid_indica">Hybrid (Indica dominant)</option>
          <option value="hybrid_sativa">Hybrid (Sativa dominant)</option>
          <option value="hybrid_balanced">Hybrid (50/50)</option>
          <option value="unknown">Unknown</option>
        </Input>

        <Input
          group="cultivar"
          v-model="state.patch.cultivar.acquisition"
          :placeholder="state.patch.cultivar.acquisition"
          type="select"
          id="acquisition"
          name="acquisition"
          label="Genetic acquisition"
          class="w-full"
        >
          <option value="seeds">Seeds</option>
          <option value="clone">Clone</option>
        </Input>

        <Input
          group="cultivar"
          v-model="state.patch.cultivar.notes"
          :placeholder="state.patch.cultivar.notes"
          type="textarea"
          id="notes"
          name="notes"
          label="Notes"
          class="w-full"
        />
      </form>

      <!-- NEW CYCLE -->

      <form
        v-if="drawerContext == 'new-cycle' || drawerContext == 'csv-upload'"
      >
        <!-- <div
          class="form-control flex flex-col justify-start gap-4 mt-4 p-8 pb-0"
        >
          <Input
            group="cycle"
            label="Start new cycle from scratch"
            type="radio"
            name="init"
            id="manual"
            value="manual"
            v-model="state.cycle.csv.init"
            checked
          />
          <Input
            group="cycle"
            label="Upload existing cycle data"
            type="radio"
            name="init"
            id="csv"
            value="csv"
            v-model="state.cycle.csv.init"
          />
        </div> -->
        <div
          v-if="state.cycle.csv.init == 'csv'"
          class="form-control flex flex-col p-8 gap-4"
        >
          <Input
            group="cycle"
            v-model="state.cycle.csv.origin.value"
            type="select"
            id="csv_origin"
            name="csv_origin"
            label="Where did your data come from?"
            rules="required"
            @validation="handleCsvValidation"
            class="w-full"
          >
            <option value="spreadsheet">Spreadsheet (Manual logging)</option>
            <option value="aroya">Aroya (Automatic logging)</option>
            <option value="other">Other</option>
          </Input>
          <Input
            @input="handleFileInput"
            group="cycle"
            v-model="state.cycle.csv.files"
            :label="`Upload your ${
              state.cycle.csv.origin.value == 'aroya'
                ? 'Aroya data'
                : 'grow data'
            } (CSV)`"
            type="file"
            accept=".csv, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            id="csv_file"
            name="csv_file"
            class="w-full"
            rules="required"
            @validation="handleCsvValidation"
          />
        </div>
        <div v-else class="flex flex-col p-8">
          <Input
            group="cycle"
            v-model="state.payload.cycle.start_date.value"
            label="Start Date"
            type="date"
            id="start_date"
            name="start_date"
            rules="required"
            @validation="handleValidation"
            class="w-full"
          />
          <!-- ⛳️ -->
          <Input
            group="cycle"
            v-model="state.payload.cycle.cultivar.value"
            id="cultivar"
            name="cultivar"
            type="select"
            label="Cultivar"
            rules="required"
            @validation="handleValidation"
            class="w-full"
          >
            <option
              v-for="(option, index) in state.data.cultivars"
              :key="index"
              :value="option?.id"
            >
              {{ `${option?.name}` }}
            </option>
          </Input>
          <Input
            group="cycle"
            v-model="state.payload.cycle.room.value"
            id="room"
            name="room"
            type="select"
            dynamic
            label="Room"
            rules="required"
            @validation="handleValidation"
            @addItem="handleAddItem"
            @change="handleRoomChange"
            class="w-full"
          >
            <option
              v-for="(option, index) in state.data.rooms"
              :key="index"
              :value="option?.id"
            >
              {{ `${option?.name}` }}
            </option>
          </Input>
          <Input
            group="cycle"
            v-model="state.payload.cycle.zone.value"
            id="zone"
            name="zone"
            type="select"
            dynamic
            label="Zone"
            rules="required"
            @validation="handleValidation"
            @addItem="handleAddItem"
            :disabled="
              state.payload.cycle.room.value == '' ||
              !state.payload.cycle.room.value
            "
            :class="
              state.payload.cycle.room.value == '' ||
              !state.payload.cycle.room.value
                ? 'opacity-50'
                : ''
            "
            class="w-full"
          >
            <!-- TODO: only display zones that belong to the selected room -->
            <option
              v-for="(option, index) in state.data.zones"
              :key="index"
              :value="option?.id"
            >
              {{ `${option?.name}` }}
            </option>
          </Input>
          <Input
            group="cycle"
            v-model="state.payload.cycle.plants.value"
            id="plants"
            name="plants"
            type="number"
            label="Number of plants"
            rules="required|min:1"
            :min="1"
            @validation="handleValidation"
            class="w-full"
          />
          <Input
            group="cycle"
            v-model="state.payload.cycle.substrate.value"
            id="substrate"
            name="substrate"
            type="select"
            label="Substrate"
            rules="required"
            @validation="handleValidation"
            class="w-full"
          >
            <option value="soil">Soil</option>
            <option value="coco_coir">Coco coir</option>
            <option value="rockwool">Rockwool</option>
            <option value="perlite">Perlite</option>
            <option value="vermiculite">Vermiculite</option>
            <option value="peat_moss">Peat moss</option>
            <option value="perlite_coco_coir">Perlite / Coco coir</option>
            <option value="perlite_vermiculite">Perlite / Vermiculite</option>
            <option value="peat_moss">Peat moss / Soilless</option>
            <option value="soilless">Soilless</option>
          </Input>
          <Input
            group="cycle"
            v-model="state.payload.cycle.root_zone_style.value"
            type="select"
            id="root_zone_style"
            name="root_zone_style"
            label="Root zone style"
            rules="required"
            @validation="handleValidation"
            class="w-full"
          >
            <option value="planter">Individual pot / planter</option>
            <option value="vertical">Vertical</option>
            <option value="soil_bed">Soil bed</option>
          </Input>
          <Input
            group="cycle"
            v-model="state.payload.cycle.nutrients_type.value"
            type="select"
            label="Nutrients type"
            id="nutrients_type"
            name="nutrients_type"
            rules="required"
            @validation="handleValidation"
            class="w-full"
          >
            <option value="organic">Commercial brand</option>
            <option value="inorganic">Custom blend</option>
          </Input>
        </div>
      </form>

      <!-- NEW RECORD -->

      <form v-if="drawerContext == 'new-record'" class="flex flex-col p-8">
        <Input
          v-for="(input, index) in state.payload.record"
          :key="index"
          group="record"
          type="number"
          v-model="state.payload.record[index].value"
          :id="input.name"
          :name="input.name"
          :label="input.label"
          class="w-full"
        />
      </form>

      <!-- DRAWER FOOTER -->

      <div
        class="absolute bottom-0 h-[80px] w-full border-t border-base-300 flex justify-end items-center px-4 gap-2"
      >
        <label
          @click="router.push({ hash: '' })"
          for="drawer"
          class="btn btn-ghost px-6"
        >
          Cancel
        </label>
        <DrawerToggle
          class="btn-primary"
          @click="handleSubmit"
          :disabled="
            route.hash.substring(1).split('–')[0] == 'edit' ||
            drawerContext == 'new-record'
              ? false
              : !valid
          "
          :for="drawerContext"
          label="Submit"
        />
      </div>
    </div>
  </div>
</template>
