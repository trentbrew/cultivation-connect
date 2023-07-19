<script setup>
  import utils from '@/helpers/utils'
  import ranges from '@/data/ranges'

  const pb = usePocketbase()
  const global = useGlobalStore()
  const route = useRoute()
  const router = useRouter()

  const state = reactive({
    loading: true,
    facility: '',
    avatar_url: '',
    payload: {
      avatar: null,
      username: {
        editing: false,
        value: '',
      },
      email: {
        editing: false,
        value: '',
      },
    },
    data: {
      sensors: [],
      cultivars: [],
    },
    settings: {
      account: {
        collection: 'users',
        fields: [
          {
            name: 'first_name',
            label: 'First Name',
            type: 'text',
            value: '',
          },
          {
            name: 'last_name',
            label: 'Last Name',
            type: 'text',
            value: '',
          },
          {
            name: 'username',
            label: 'Username',
            type: 'text',
            value: '',
          },
          {
            name: 'email',
            label: 'Email',
            type: 'text',
            value: '',
          },
        ],
      },
      facility: {
        collection: 'facilities',
        fields: [
          {
            name: 'company_name',
            label: 'Company Name',
            type: 'text',
            value: '',
          },
          {
            name: 'address',
            label: 'Address',
            type: 'text',
            value: '',
          },
          {
            name: 'city',
            label: 'City',
            type: 'text',
            value: '',
          },
          {
            name: 'state',
            label: 'State',
            type: 'text',
            value: '',
          },
          {
            name: 'zip_code',
            label: 'Zip Code',
            type: 'text',
            value: '',
          },
        ],
      },
      sensors: {
        collection: 'sensors',
        fields: [
          {
            name: 'type',
            label: 'Type',
            type: 'text',
            value: '',
          },
          {
            name: 'condition',
            label: 'Condition',
            type: 'text',
            value: '',
          },
          {
            name: 'brand',
            label: 'Brand',
            type: 'text',
            value: '',
          },
          {
            name: 'calibration_date',
            label: 'Calibration Date',
            type: 'date',
            value: '',
          },
        ],
      },
      ranges: {
        collection: 'ranges',
        payload: null,
      },
    },
  })

  async function fetchData() {
    console.log('fetching data...')
    state.data.sensors = await pbFetch('sensors')
    state.data.cultivars = await pbFetch('cultivars')
    console.log(state.data.sensors)
  }

  function pbFetch(collection, options) {
    return pb.get(collection, {
      filter: `facility.id = "${pb.api.authStore.model.facility}"${
        options?.filter ? ` && ${options.filter}` : ''
      }`,
      ...options,
    })
  }

  onBeforeMount(async () => {
    console.log('settings created')
    state.loading = true
  })

  onMounted(async () => {
    console.log('settings mounted')
    fetchData()
    state.loading = false
    state.facility = await getFacilityName()
    state.avatarUrl = await pb.getAvatarUrl()
    const contactEmail = pb.api.authStore.model.contact_email
    if (!contactEmail) {
      await pb
        .update('users', pb.api.authStore.model.id, {
          contact_email: pb.api.authStore.model.email,
        })
        .then(() => {
          console.log('contact_email updated')
        })
        .catch(err => {
          console.log('error updating contact_email: ', err)
        })
    }
  })

  const settingsContext = computed(() => route.path.split('/')[2])

  function edit(context) {
    console.log('editing: ', context)
    state.payload[context].editing = true
  }

  function handleFileInput(event) {
    if (event.target.files[0]) {
      state.payload.avatar = event.target.files[0]
    }
  }

  async function getFacilityName() {
    const facility = pb.api.authStore.model.facility
    const data = await pb.get('facilities', { id: facility })
    return data.company_name
  }

  async function refresh() {
    state.facility = await getFacilityName()
    state.avatarUrl = await pb.getAvatarUrl()
  }

  async function updateUsername() {
    await pb.update('users', pb.api.authStore.model.id, {
      username: state.payload.username.value,
    })
    refresh()
    global.toast('default', 'Username has been updated')
    state.payload.username.editing = false
  }

  async function updateEmail() {
    await pb.update('users', pb.api.authStore.model.id, {
      contact_email: state.payload.email.value,
    })
    refresh()
    global.toast('default', 'Email has been updated')
    state.payload.email.editing = false
  }

  // async function update(id, payload) {
  //   const category = categories.find(c => c.name == settingsContext.value)
  //   if (category?.name != 'ranges') {
  //     await pb.update(category.collection, id, payload)
  //   } else {
  //     // TODO: update ranges.js
  //     console.log('handling local range update...')
  //   }
  //   refresh()
  //   global.toast(
  //     'primary',
  //     `${utils.capitalize(category.name)} data has been updated`
  //   )
  //   state.payload.account[Object.entries(payload)[0][0]].editing = false
  // }

  function handleCancel() {
    state.payload.username.editing = false
    state.payload.email.editing = false
  }
</script>

<template>
  <div class="w-full h-screen flex flex-col">
    <!-- HEADER -->
    <div class="flex justify-start items-center gap-6 p-8 pb-0 pl-10">
      <h1 class="text-3xl">
        <!-- <span class="text-base-content/30">Settings</span> -->
        <!-- <span class="text-base-300 mx-4">/</span> -->
        <span class="font-normal">
          {{ utils.capitalize(route.path.split('/')[2]) }}
        </span>
      </h1>
    </div>
    <div class="w-full h-full !pt-0 flex justify-center items-center">
      <!-- ACCOUNT SETTINGS -->
      <div
        v-if="settingsContext == 'account'"
        class="w-full flex flex-col justify-between items-end h-full p-8 bg-base-200/10 z-50"
      >
        <div class="stats stats-vertical rounded w-full border border-base-300">
          <div class="stat">
            <div class="stat-title">Facility</div>
            <div class="stat-value text-xl">
              {{ state.facility }}
            </div>
          </div>
          <div class="stat">
            <div class="stat-title">Username</div>
            <div class="stat-value text-xl flex justify-between">
              <span v-show="!state.payload.username.editing">
                {{ pb.api.authStore.model.username }}
              </span>
              <Icon
                @click="edit('username')"
                v-show="!state.payload.username.editing"
                name="edit"
                class="hover:opacity-50 cursor-pointer"
              />
              <input
                class="bg-base-200/50 h-[32px] w-full mr-2 rounded-[8px]"
                v-show="state.payload.username.editing"
                v-model="state.payload.username.value"
                type="text"
              />
              <div v-show="state.payload.username.editing" class="flex gap-2">
                <button @click="handleCancel" class="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button @click="updateUsername" class="btn btn-primary btn-sm">
                  Save
                </button>
              </div>
            </div>
          </div>
          <div class="stat">
            <div class="stat-title">Email</div>
            <div class="stat-value text-xl flex justify-between">
              <span v-show="!state.payload.email.editing">
                {{
                  pb.api.authStore.model.contact_email ??
                  pb.api.authStore.model.email
                }}
              </span>
              <Icon
                @click="edit('email')"
                v-show="!state.payload.email.editing"
                name="edit"
                class="hover:opacity-50 cursor-pointer"
              />
              <input
                class="bg-base-200/50 h-[32px] w-full mr-2 rounded-[8px]"
                v-show="state.payload.email.editing"
                v-model="state.payload.email.value"
                type="text"
              />
              <div v-show="state.payload.email.editing" class="flex gap-2">
                <button @click="handleCancel" class="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button @click="updateEmail" class="btn btn-primary btn-sm">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- CULTIVAR SETTINGS -->
      <div
        v-if="settingsContext == 'cultivars'"
        class="w-full flex flex-col justify-between items-end h-full p-8 bg-base-200/10 z-50"
      >
        <Table
          class="w-full rounded-b-none"
          :placeholder-columns="['name', 'phenotype', 'genetic acquisition']"
          :data="state.data.cultivars"
          :class="state.data.cultivars.length == 0 ? 'border-none' : ''"
        />
        <div
          v-if="state.data.sensors.length == 0"
          class="bg-base-100 border border-base-300 w-full h-60 flex justify-center items-center rounded-b"
        >
          <DrawerToggle
            icon="plus"
            for="new-cultivar"
            label="Add cultivars"
            class="btn-outline !w-fit !px-4"
          />
        </div>
        <DrawerToggle
          v-else
          icon="plus"
          for="new-cultivar"
          label="Add cultivars"
          class="btn-outline !w-fit !px-4 absolute top-6 right-8"
        />
      </div>
      <!-- SENSOR SETTINGS -->
      <div
        v-if="settingsContext == 'sensors'"
        class="w-full flex flex-col justify-start items-end h-full p-8 bg-base-200/10 z-50"
      >
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
            icon="plus"
            for="new-sensor"
            label="Add a new sensor"
            class="btn-outline !w-fit !px-4"
          />
        </div>
        <DrawerToggle
          v-else
          for="new-sensor"
          icon="plus"
          label="Add a new sensor"
          class="btn-outline !w-fit !px-4 absolute top-6 right-8"
        />
      </div>
      <!-- RANGE SETTINGS -->
      <div
        v-if="settingsContext == 'ranges'"
        class="w-full flex flex-col justify-start h-full p-8 bg-base-200/10 z-50"
      >
        <div
          class="overflow-y-scroll border border-1 border-base-300 max-h-[calc(100vh-130px)] rounded-[16px]"
        >
          <Accordion>
            <AccordionItem
              v-for="(field, fieldIndex) in ranges.sort((a, b) => {
                if (a.title < b.title) return -1
                if (a.title > b.title) return 1
                return 0
              })"
              :key="fieldIndex"
              :title="field.title"
              class="font-bold"
            >
              <InputRange
                :data="{
                  unit: field.unit,
                  step: field.step,
                  abs_min: field.relative_min,
                  rel_min: field.min[0] - field.margin[0],
                  min: field.min[0],
                  max: field.max[0],
                  rel_max: field.max[0] + field.margin[0],
                  abs_max: field.relative_max,
                }"
              />
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
</template>
