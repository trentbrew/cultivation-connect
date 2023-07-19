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

  onBeforeMount(async () => {
    console.log('settings created')
    state.loading = true
  })

  onMounted(async () => {
    console.log('settings mounted')
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
    state.payload.account[context].editing = true
  }

  function handleFileInput(event) {
    if (event.target.files[0]) {
      state.payload.account.avatar = event.target.files[0]
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

  async function update(id, payload) {
    const category = categories.find(c => c.name == settingsContext.value)
    if (category?.name != 'ranges') {
      await pb.update(category.collection, id, payload)
    } else {
      // TODO: update ranges.js
      console.log('handling local range update...')
    }
    refresh()
    global.toast(
      'primary',
      `${utils.capitalize(category.name)} data has been updated`
    )
    state.payload.account[Object.entries(payload)[0][0]].editing = false
  }

  function handleCancel() {
    state.payload.account.username.editing = false
    state.payload.account.email.editing = false
  }
</script>

<template>
  <div class="w-full h-screen flex flex-col">
    <!-- HEADER -->
    <!-- <div class="flex justify-start items-center gap-6 p-4 pl-6">
      <h1 class="text-lg">
        <span class="text-base-content/30">Settings</span>
        <span class="text-base-300 mx-4">/</span>
        <span class="font-bold">
          {{ utils.capitalize(route.path.split('/')[2]) }}
        </span>
      </h1>
    </div> -->
    <div class="w-full h-full !pt-0 flex justify-center items-center">
      <Loading size="64" class="absolute" />
      <!-- RANGE SETTINGS -->
      <div
        v-if="settingsContext == 'ranges'"
        class="w-full flex flex-col justify-start h-full p-8 bg-base-200/10 z-50"
      >
        <!-- <div class="h-32 w-32 rounded-full mb-8">
          <img :src="state.avatarUrl" alt="Avatar" class="rounded-full" />
        </div>
        <h1 class="text-3xl font-bold mb-10">
          {{ pb.api.authStore.model.first_name }}
          {{ pb.api.authStore.model.last_name }}
        </h1> -->
        <div
          class="overflow-y-scroll border border-1 border-base-300 max-h-[calc(100vh-64px)]"
        >
          <Accordion>
            <AccordionItem
              v-for="(field, fieldIndex) in ranges"
              :key="fieldIndex"
              :title="field.title"
              class="font-bold"
            >
              <InputRange
                :data="{
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
