<!--

  Name: intake.vue
  Author: Trent Brew (https://github.com/trentbrew)
  Last edited: 5/12/2023
  Description: Intake form for new facilities

 -->

<script setup>
  import utils from '@/helpers/utils'

  const pb = usePocketbase()
  const global = useGlobalStore()
  const router = useRouter()

  const state = reactive({
    debug: false,
    progress: 0,
    sections: [],
    currentSection: 0,
    placeholders: {
      room_grow_area: 0,
      total_grow_area: 0,
    },
    payload: {
      farm: {
        valid: false,
        company_name: {
          value: '',
          valid: false,
        },
        facility_type: {
          value: '',
          valid: false,
        },
        street: {
          value: '',
          valid: false,
        },
        city: {
          value: '',
          valid: false,
        },
        state: {
          value: null,
          valid: false,
        },
        zip: {
          value: '',
          valid: false,
        },
        number_of_zones: {
          value: 1,
          valid: false,
        },
        zone_square_footage: {
          value: 0,
          valid: false,
        },
        number_of_rooms: {
          value: 1,
          valid: false,
        },
        room_square_footage: {
          value: null,
          valid: false,
        },
        grow_surface_area: {
          value: null,
          valid: false,
        },
      },
      cultivation: {
        sop: {
          value: '',
          valid: true,
        },
        irrigation_type: {
          value: '',
          valid: false,
        },
        irrigation_management: {
          value: '',
          valid: false,
        },
        water_source: {
          value: '',
          valid: false,
        },
        water_source_ph: {
          value: 0,
          valid: false,
        },
        water_source_ppm: {
          value: 0,
          valid: false,
        },
        elevation: {
          value: 0,
          valid: false,
        },
        lighting_type: {
          value: '',
          valid: false,
        },
        ceiling_height: {
          value: 0,
          valid: false,
        },
        lights_on: {
          value: '',
          valid: false,
        },
        lights_off: {
          value: '',
          valid: false,
        },
      },
    },
    data: {
      farm: {},
      cultivars: [],
      sensors: [],
    },
  })

  function updateGrowArea() {
    console.log('updateGrowArea')
    const room_grow_area =
      Number(state.payload.farm.zone_square_footage.value) *
      Number(state.payload.farm.number_of_zones.value) *
      Number(state.payload.farm.number_of_rooms.value)
    console.log('room_grow_area: ', room_grow_area)
    state.placeholders.room_grow_area = room_grow_area
    const total_grow_area =
      Number(state.payload.farm.number_of_rooms.value) *
      Number(
        state.payload.farm.room_square_footage.value ||
          state.placeholders.room_grow_area
      )
    console.log('total_grow_area: ', total_grow_area)
    state.placeholders.total_grow_area = total_grow_area
  }

  watch(
    () => state.payload.farm.number_of_rooms.value,
    newVal => {
      updateGrowArea()
    }
  )
  watch(
    () => state.payload.farm.number_of_zones.value,
    newVal => {
      updateGrowArea()
    }
  )
  watch(
    () => state.payload.farm.zone_square_footage.value,
    newVal => {
      updateGrowArea()
    }
  )

  const inferredRoomArea = computed(() => {
    const result =
      Number(state.payload.number_of_zones ?? 1) *
      Number(state.payload.zone_square_footage ?? 0)
    console.log('inferredRoomArea: ', result)
    return result
  })

  const inferredGrowArea = computed(() => {
    const result =
      Number(state.payload.number_of_rooms ?? 1) *
      Number(inferredRoomArea.value ?? 0)
    console.log('inferredGrowArea: ', result)
    return result
  })

  const states = [
    ['Alabama', 'AL'],
    ['Alaska', 'AK'],
    ['Arizona', 'AZ'],
    ['Arkansas', 'AR'],
    ['California', 'CA'],
    ['Colorado', 'CO'],
    ['Connecticut', 'CT'],
    ['Delaware', 'DE'],
    ['Florida', 'FL'],
    ['Georgia', 'GA'],
    ['Hawaii', 'HI'],
    ['Idaho', 'ID'],
    ['Illinois', 'IL'],
    ['Indiana', 'IN'],
    ['Iowa', 'IA'],
    ['Kansas', 'KS'],
    ['Kentucky', 'KY'],
    ['Louisiana', 'LA'],
    ['Maine', 'ME'],
    ['Maryland', 'MD'],
    ['Massachusetts', 'MA'],
    ['Michigan', 'MI'],
    ['Minnesota', 'MN'],
    ['Mississippi', 'MS'],
    ['Missouri', 'MO'],
    ['Montana', 'MT'],
    ['Nebraska', 'NE'],
    ['Nevada', 'NV'],
    ['New Hampshire', 'NH'],
    ['New Jersey', 'NJ'],
    ['New Mexico', 'NM'],
    ['New York', 'NY'],
    ['North Carolina', 'NC'],
    ['North Dakota', 'ND'],
    ['Ohio', 'OH'],
    ['Oklahoma', 'OK'],
    ['Oregon', 'OR'],
    ['Pennsylvania', 'PA'],
    ['Rhode Island', 'RI'],
    ['South Carolina', 'SC'],
    ['South Dakota', 'SD'],
    ['Tennessee', 'TN'],
    ['Texas', 'TX'],
    ['Utah', 'UT'],
    ['Vermont', 'VT'],
    ['Virginia', 'VA'],
    ['Washington', 'WA'],
    ['West Virginia', 'WV'],
    ['Wisconsin', 'WI'],
    ['Wyoming', 'WY'],
  ]

  onMounted(async () => {
    if (pb.api.authStore.model.onboarded) router.push('/facility')
    let elements = await document.getElementsByTagName('section')
    state.sections = Array.from(elements).map(el => el.id)
    if (pb.api.authStore.model.facility) fetchData()
    window.addEventListener('beforeunload', e => {
      if (state.currentSection > 0) {
        e.preventDefault()
        e.returnValue = ''
        return 'Are you sure you want to exit? Your progress will not be saved.'
      }
    })
    window.addEventListener('unload', e => {
      pb.delete('facilities', pb.api.authStore.model.facility)
    })
  })

  const sensors = computed(() => global.getCache('sensors'))
  const cultivars = computed(() => global.getCache('cultivars'))

  watch(
    () => sensors.value,
    newVal => {
      console.log('sensors changed: ', newVal)
      state.data.sensors.push(newVal)
    }
  )

  watch(
    () => cultivars.value,
    newVal => {
      console.log('cultivars changed: ', newVal)
      state.data.cultivars.push(newVal)
    }
  )

  async function fetchData() {
    console.log('fetching data...')
    pb.get('facilities', {
      id: pb.api.authStore.model.facility,
    }).then(data => {
      console.log('fetched facility: ', data)
      // Object.entries(data).forEach(item => {
      //   console.log(item);
      //   if (state.payload.farm && state.payload.farm[item[0]]) {
      //     state.payload.farm[item[0]].value = item[1];
      //     state.payload.farm[item[0]].valid = true;
      //   }
      // });
      // console.log('autofilled payload: ', state.payload.farm);
      // TODO: unwrap the address string and autofill the address fields
    })
    state.data.sensors = await fetch('sensors')
    state.data.cultivars = await fetch('cultivars')
    console.log('intake: state.data', state.data)
  }

  // This function ensures that the fetched data belongs to the current facility

  function fetch(collection, options) {
    return pb.get(collection, {
      filter: `facility.id = "${pb.api.authStore.model.facility}"${
        options?.filter ? ` && ${options.filter}` : ''
      }`,
      ...options,
    })
  }

  function handleValidation(e) {
    state.payload[e.group][e.id].valid = e.valid
    const groupValidity = Object.values(state.payload[e.group]).map(
      item => item.valid
    )
    state.payload[e.group].valid = !groupValidity.includes(false)
  }

  function handleScroll(e) {
    let scrollTop = e.target.scrollTop
    let scrollHeight = e.target.scrollHeight
    let clientHeight = e.target.clientHeight
    state.progress = (scrollTop / (scrollHeight - clientHeight)) * 100
  }

  function scrollTo(id) {
    const el = document.getElementById(id)
    el.scrollIntoView({ behavior: 'smooth' })
    state.currentSection = state.sections.indexOf(id)
  }

  function createFacility() {
    let payload = {}
    Object.keys(state.payload.farm).forEach(key => {
      if (key != 'valid') payload[key] = state.payload.farm[key].value
    })
    console.log('creating facility...', payload)
    if (pb.api.authStore.model.facility) {
      pb.update('facilities', pb.api.authStore.model.facility, payload).then(
        res => {
          console.log('✅ updated facility', res)
          scrollTo('cultivation')
        }
      )
    } else {
      pb.post('facilities', {
        ...payload,
        facility_address: parseAddress('farm'),
        grow_surface_area_unit: 'acres', // TODO: Add dynamic unit selection
      }).then(res => {
        console.log('✅ created facility', res)
        pb.update('users', pb.api.authStore.model.id, {
          facility: res.id,
        }).then(res => {
          console.log('✅ updated user (res)', res)
          console.log(
            '✅ updated user (authStore.model)',
            pb.api.authStore.model
          )
          scrollTo('cultivation')
        })
      })
    }
  }

  function updateFacility() {
    let payload = {}
    Object.keys(state.payload.cultivation).forEach(key => {
      if (key != 'valid') payload[key] = state.payload.cultivation[key].value
    })
    console.log(`submitting cultivation data...`, payload)
    pb.update('facilities', pb.api.authStore.model.facility, payload).then(
      res => {
        console.log('✅ updated facility with the cultivation data', res)
        scrollTo('sensors')
      }
    )
  }

  function parseAddress(ctx) {
    return `${state.payload[ctx].street.value}, ${state.payload[ctx].city.value}, ${state.payload[ctx].state.value} ${state.payload[ctx].zip.value}`
  }

  function completeIntakeForm() {
    pb.update('users', pb.api.authStore.model.id, {
      onboarded: true,
    }).then(res => {
      console.log('✅ updated user (res)', res)
      console.log('✅ updated user (authStore.model)', pb.api.authStore.model)
      router.push('/facility')
    })
  }
</script>

<template>
  <AuthRouteGuard>
    <progress
      class="absolute top-0 left-0 progress progress-primary w-full z-10"
      :class="state.progress === 100 ? 'progress-primary' : ''"
      :value="state.progress"
      max="100"
    ></progress>

    <div class="absolute left-16 top-16 flex items-center">
      <span
        class="countdown font-mono text-6xl"
        :class="
          state.currentSection === 0
            ? 'text-base-300'
            : state.currentSection === state.sections.length - 1
            ? 'text-primary'
            : 'text-base-content'
        "
      >
        <span :style="`--value: ${state.currentSection}`"></span>
      </span>
      <div
        class="duration-[2s]"
        :class="state.currentSection === -1 ? 'opacity-0' : 'opacity-1'"
      >
        <span class="text-xl text-base-300 mx-3">/</span>
        <span class="text-xl text-base-300">
          {{ state.sections.length - 1 }}
        </span>
      </div>
    </div>

    <div class="absolute top-16 right-16 dropdown dropdown-end cursor-pointer">
      <label tabindex="0" class="btn btn-ghost !px-4 cursor-pointer">
        <Icon name="dots_horizontal" />
      </label>
      <ul
        tabindex="0"
        class="dropdown-content menu w-40 text-left border bg-base-100 border-base-300 rounded mb-3"
      >
        <li>
          <ModalTrigger
            @click="
              global.toast('default', 'This feature is under development,')
            "
            target="help"
            class="justify-start"
          >
            <Icon name="light_bulb" size="18" />
            <span class="text-base">Help</span>
          </ModalTrigger>
        </li>
        <li>
          <ModalTrigger
            target="confirmation"
            class="text-error active:bg-error active:text-error-content justify-start"
          >
            <Icon name="exit" size="18" />
            <span class="text-base">Logout</span>
          </ModalTrigger>
        </li>
      </ul>
    </div>

    <main v-on:scroll="handleScroll">
      <!-- INTRO -->

      <section id="intro">
        <h1 class="!text-3xl font-bold !mb-4">
          {{ `Hi, ${pb.api.authStore.model.first_name}!` }}
        </h1>
        <p class="text-center opacity-60">
          Welcome to Cultivation Connect. Let's get started
          <br />
          by learning about you and your farm.
        </p>
        <button
          @click="scrollTo('farm')"
          class="btn btn-primary flex gap-2 pr-6 mt-4"
        >
          <Icon name="arrow_down" />
          <span>Continue</span>
        </button>
      </section>

      <!-- FARM -->

      <section id="farm">
        <div class="w-[50%] gap-4">
          <h1 class="text-xl">Farm information</h1>
          <div class="w-full flex gap-4">
            <div class="form-control w-full">
              <Input
                id="company_name"
                v-model="state.payload.farm.company_name.value"
                type="text"
                label="Company name"
                group="farm"
                rules="required"
                @validation="handleValidation"
                class="w-full"
              />
            </div>
            <div class="form-control w-full">
              <Input
                id="facility_type"
                label="Facility type"
                v-model="state.payload.farm.facility_type.value"
                type="select"
                group="farm"
                rules="required"
                @validation="handleValidation"
                class="w-full"
              >
                <option value="outdoor_farm">Outdoor</option>
                <option value="indoor_vertical_farm">Indoor</option>
                <option value="indoor_greenhouse">Greenhouse</option>
              </Input>
            </div>
          </div>
          <div class="w-full flex gap-4">
            <div class="form-control w-full">
              <Input
                id="street"
                v-model="state.payload.farm.street.value"
                type="text"
                label="Street address"
                group="farm"
                rules="required"
                @validation="handleValidation"
                class="w-full"
              />
            </div>
            <div class="form-control w-full">
              <Input
                id="city"
                label="City"
                v-model="state.payload.farm.city.value"
                type="text"
                group="farm"
                rules="required"
                @validation="handleValidation"
                class="w-full"
              />
            </div>
            <div class="form-control w-full">
              <Input
                id="state"
                type="select"
                label="State"
                v-model="state.payload.farm.state.value"
                group="farm"
                rules="required"
                @validation="handleValidation"
                class="w-full"
              >
                <option
                  v-for="(state, index) in states"
                  :key="index"
                  :value="state[1]"
                >
                  {{ state[0] }}
                </option>
              </Input>
            </div>
            <div class="form-control w-full">
              <Input
                id="zip"
                v-model="state.payload.farm.zip.value"
                label="Zip"
                type="text"
                group="farm"
                rules="required|zipcode"
                @validation="handleValidation"
                class="w-full"
              />
            </div>
          </div>
          <div class="flex gap-4 w-full">
            <div class="w-full">
              <Input
                id="number_of_zones"
                label="Number of zones"
                v-model="state.payload.farm.number_of_zones.value"
                type="number"
                class="w-full"
                min="1"
                rules="required"
                @validation="handleValidation"
                group="farm"
              />
            </div>
            <div class="w-full">
              <Input
                id="zone_square_footage"
                label="Zone area (sqft)"
                v-model="state.payload.farm.zone_square_footage.value"
                type="number"
                class="w-full"
                rules="required"
                @validation="handleValidation"
                min="0"
                group="farm"
              />
            </div>
          </div>
          <div class="flex gap-4 w-full">
            <div class="w-full">
              <Input
                id="number_of_rooms"
                label="Number of rooms"
                v-model="state.payload.farm.number_of_rooms.value"
                type="number"
                placeholder="Number of rooms"
                class="w-full"
                min="1"
                rules="required"
                @validation="handleValidation"
                group="farm"
              />
            </div>
            <div class="w-full">
              <Input
                id="room_square_footage"
                label="Room area (sqft)"
                v-model="state.payload.farm.room_square_footage.value"
                type="number"
                :placeholder="state.placeholders.room_grow_area"
                @validation="handleValidation"
                rules="required"
                class="w-full"
                group="farm"
              />
            </div>
          </div>
          <Input
            id="grow_surface_area"
            label="Canopy grow area (sqft)"
            v-model="state.payload.farm.grow_surface_area.value"
            type="number"
            min="0"
            rules="required"
            @validation="handleValidation"
            :placeholder="state.placeholders.total_grow_area"
            class="w-full"
            group="farm"
          />
          <div class="flex gap-4 mt-12 w-full justify-start">
            <button
              @click="scrollTo('intro')"
              class="btn btn-outline flex gap-2 pr-6"
            >
              <Icon name="arrow_up" />
              <span>Back</span>
            </button>
            <button
              @click="createFacility"
              class="btn btn-primary flex gap-2 pr-6"
              :disabled="state.debug ? false : !state.payload.farm.valid"
            >
              <Icon name="arrow_down" />
              <span>Continue</span>
            </button>
          </div>
        </div>
      </section>

      <!-- CULTIVATION -->

      <section id="cultivation">
        <div class="w-[50%] gap-4">
          <h1 class="text-xl">Irrigation, lighting, and nutrients</h1>
          <div class="flex items-center gap-4 mt-4 mb-8">
            <div class="flex items-center gap-3">
              <Input
                type="radio"
                class="radio"
                label="My irrigation procedure is manual"
                name="sop"
                id="manual_sop"
                value="manual_sop"
                checked
                v-model="state.payload.cultivation.sop.value"
                group="cultivation"
              />
            </div>
            <div class="flex items-center gap-3">
              <Input
                type="radio"
                class="radio"
                label="My irrigation procedure is automatic"
                name="sop"
                id="auto_sop"
                value="auto_sop"
                v-model="state.payload.cultivation.sop.value"
                group="cultivation"
              />
            </div>
          </div>
          <div class="flex gap-4 w-full">
            <div class="form-control w-full">
              <Input
                id="irrigation_type"
                type="select"
                v-model="state.payload.cultivation.irrigation_type.value"
                class="w-full"
                label="Irrigation type"
                @validation="handleValidation"
                rules="required"
                group="cultivation"
              >
                <option value="drip">Drip</option>
                <option value="sprinkler">Sprinkler</option>
                <option value="flood">Flood</option>
                <option value="flood">Hand watering</option>
              </Input>
            </div>
            <div class="form-control w-full">
              <Input
                id="irrigation_management"
                label="Irrigation management"
                v-model="state.payload.cultivation.irrigation_management.value"
                class="w-full"
                type="select"
                @validation="handleValidation"
                rules="required"
                group="cultivation"
              >
                <option value="drain">Drain to waste</option>
                <option value="recirculating">Recirculating</option>
              </Input>
            </div>
          </div>
          <div class="flex gap-4 w-full">
            <div class="w-full">
              <Input
                id="water_source"
                label="Water source"
                v-model="state.payload.cultivation.water_source.value"
                class="w-full"
                @validation="handleValidation"
                rules="required"
                type="select"
                group="cultivation"
              >
                <option value="tap">Tap water</option>
                <option value="well">Well water</option>
                <option value="rain">Rain water</option>
                <option value="distilled">Distilled water</option>
                <option value="osmosis">Reverse Osmosis</option>
              </Input>
            </div>
            <div class="w-full">
              <Input
                id="water_source_ph"
                label="Water source pH"
                v-model="state.payload.cultivation.water_source_ph.value"
                type="number"
                class="w-full"
                @validation="handleValidation"
                rules="required"
                min="5.0"
                max="8.5"
                group="cultivation"
              />
            </div>
            <div class="w-full">
              <Input
                id="water_source_ppm"
                label="Water source ppm"
                v-model="state.payload.cultivation.water_source_ppm.value"
                type="number"
                @validation="handleValidation"
                min="0"
                rules="required"
                placeholder="Water source ppm"
                class="w-full"
                group="cultivation"
              />
            </div>
          </div>
          <div class="form-control w-full">
            <Input
              id="elevation"
              label="Elevation (ft)"
              min="0"
              @validation="handleValidation"
              v-model="state.payload.cultivation.elevation.value"
              type="number"
              placeholder="Elevation"
              class="w-full"
              rules="required"
              group="cultivation"
            />
          </div>
          <!-- TODO: check if testable_runoff this is necessary -->
          <div class="flex gap-4">
            <div class="flex gap-4 w-full">
              <div class="form-control w-full">
                <Input
                  id="lighting_type"
                  label="Lighting type"
                  type="select"
                  @validation="handleValidation"
                  rules="required"
                  v-model="state.payload.cultivation.lighting_type.value"
                  class="w-full"
                  group="cultivation"
                >
                  <option value="led">LED</option>
                  <option value="hps">HPS</option>
                  <option value="fluorescent">Fluorescent</option>
                  <option value="natural">Natural</option>
                </Input>
              </div>
              <div class="form-control w-full">
                <Input
                  id="ceiling_height"
                  rules="required"
                  @validation="handleValidation"
                  label="Ceiling height (ft)"
                  v-model="state.payload.cultivation.ceiling_height.value"
                  type="number"
                  placeholder="Ceiling height"
                  class="w-full"
                  min="0"
                  group="cultivation"
                />
              </div>
              <div class="form-control w-full">
                <Input
                  id="lights_on"
                  label="Lights on"
                  v-model="state.payload.cultivation.lights_on.value"
                  type="time"
                  class="w-full"
                  @validation="handleValidation"
                  rules="required"
                  group="cultivation"
                />
              </div>
              <div class="form-control w-full">
                <Input
                  id="lights_off"
                  label="Lights off"
                  v-model="state.payload.cultivation.lights_off.value"
                  type="time"
                  @validation="handleValidation"
                  rules="required"
                  placeholder="Lighting schedule"
                  class="w-full"
                  group="cultivation"
                />
              </div>
            </div>
          </div>
          <div class="flex gap-4 mt-12 w-full justify-start">
            <button
              @click="scrollTo('farm')"
              class="btn btn-outline flex gap-2 pr-6"
            >
              <Icon name="arrow_up" />
              <span>Back</span>
            </button>
            <button
              @click="updateFacility"
              class="btn btn-primary flex gap-2 pr-6"
              :disabled="state.debug ? false : !state.payload.cultivation.valid"
            >
              <Icon name="arrow_down" />
              <span>Continue</span>
            </button>
          </div>
        </div>
      </section>

      <!-- SENSORS -->

      <section id="sensors">
        <div class="w-[74%]">
          <h1 class="text-xl">Sensors</h1>
          <div class="w-full">
            <Table
              class="w-full rounded-b-none"
              :placeholder-columns="['brand', 'type', 'model', 'serial number']"
              :data="state.data.sensors"
              :class="state.data.sensors.length == 0 ? 'border-none' : ''"
            />
            <div
              v-if="state.data.sensors.length == 0"
              class="bg-base-100 border border-base-300 w-full h-60 flex justify-center items-center rounded-b"
            >
              <DrawerToggle
                for="new-sensor"
                label="Add a new sensor"
                class="btn-outline !w-fit !px-4"
              />
            </div>
          </div>
          <div class="w-full flex justify-between">
            <div class="flex gap-4 mt-8 w-full justify-start">
              <button
                @click="scrollTo('cultivation')"
                class="btn btn-outline flex gap-2 pr-6"
              >
                <Icon name="arrow_up" />
                <span>Back</span>
              </button>
              <button
                @click="scrollTo('cultivars')"
                class="btn flex gap-2 pr-6"
                :class="state.data.sensors.length > 0 ? 'btn-primary' : ''"
              >
                <Icon name="arrow_down" />
                <span>
                  {{ state.data.sensors.length > 0 ? 'Continue' : 'Skip' }}
                </span>
              </button>
            </div>
            <DrawerToggle
              v-if="state.data.sensors.length > 0"
              for="new-sensor"
              label="Add sensor"
              class="w-fit mt-8 bg-black"
              icon="plus"
            />
          </div>
        </div>
      </section>

      <!-- CULTIVARS -->

      <section id="cultivars">
        <div class="w-[74%] gap-4">
          <h1 class="text-xl">Cultivars</h1>
          <div class="w-full">
            <Table
              class="w-full rounded-b-none"
              :placeholder-columns="[
                'name',
                'phenotype',
                'genetic acquisition',
              ]"
              :data="state.data.cultivars"
              :class="state.data.cultivars.length == 0 ? 'border-none' : ''"
            />
            <div
              v-if="state.data.cultivars.length == 0"
              class="bg-base-100 border border-base-300 w-full h-60 flex justify-center items-center rounded-b"
            >
              <DrawerToggle
                for="new-cultivar"
                label="Add cultivars"
                class="btn-outline !w-fit !px-4"
              />
            </div>
          </div>
          <div class="flex w-full justify-between">
            <div class="flex gap-4 mt-12 w-full justify-start">
              <button
                @click="scrollTo('sensors')"
                class="btn btn-outline flex gap-2 pr-6"
              >
                <Icon name="arrow_up" />
                <span>Back</span>
              </button>
              <button
                @click="scrollTo('done')"
                class="btn flex gap-2 pr-6"
                :class="state.data.cultivars.length > 0 ? 'btn-primary' : ''"
              >
                <Icon name="arrow_down" />
                <span>
                  {{ state.data.cultivars.length > 0 ? 'Continue' : 'Skip' }}
                </span>
              </button>
            </div>
            <DrawerToggle
              v-if="state.data.cultivars.length > 0"
              for="new-cultivar"
              label="Add cultivars"
              class="w-fit mt-8 bg-black"
            />
          </div>
        </div>
      </section>
      <footer id="done">
        <div class="w-[50%] gap-4">
          <div class="w-full">
            <h1 class="text-xl">You're all set!</h1>
            <div class="flex gap-4 mt-12 w-full justify-start">
              <button
                @click="scrollTo('cultivars')"
                class="btn btn-outline flex gap-2 pr-6"
              >
                <Icon name="arrow_up" />
                <span>Back</span>
              </button>
              <button
                @click="completeIntakeForm"
                class="btn btn-primary flex gap-2 pr-6"
              >
                <Icon name="check_alt" />
                <span>Continue to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  </AuthRouteGuard>
</template>

<style scoped>
  main {
    @apply bg-base-100;
    height: 100vh;
    scroll-snap-type: y mandatory;
    overflow-y: hidden;
    overflow-x: hidden;
  }
  section,
  footer {
    @apply flex flex-col justify-center items-center gap-4 w-screen h-screen;
    scroll-snap-align: start;
  }
  section h1,
  footer h1 {
    @apply text-3xl mb-12 font-bold;
  }
  section form {
    @apply flex flex-col justify-center items-center;
  }
</style>
