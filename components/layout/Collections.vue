<script setup>
  const global = useGlobalStore()
  const route = useRoute()
  const router = useRouter()
  const pb = usePocketbase()

  const context = computed(() => route.name.split('-')[0])

  const state = reactive({
    search: '',
    data: [],
  })

  const settings = [
    {
      id: 'account',
      name: 'Account',
      icon: 'user',
    },
    // {
    //   id: 'facility',
    //   name: 'Facility',
    //   icon: 'home',
    // },
    {
      id: 'cultivars',
      name: 'Cultivars',
      icon: 'flower',
    },
    {
      id: 'sensors',
      name: 'Sensors',
      icon: 'thermometer',
    },
    {
      id: 'ranges',
      name: 'Ranges',
      icon: 'metrics',
    },
  ]

  onMounted(() => {
    fetchData()
  })

  async function fetchData() {
    if (route.name.includes('settings')) return
    state.data = await pb.get(context.value, {
      filter: `facility.id = "${pb.api.authStore.model.facility}"`,
    })
  }

  const filteredData = computed(() => {
    if (route.name.includes('settings')) {
      if (state.search == '') return settings
      return settings.filter(record => {
        return record.name.toLowerCase().includes(state.search.toLowerCase())
      })
    } else {
      if (state.search == '') return state.data
      return state.data.filter(record => {
        return record.name.toLowerCase().includes(state.search.toLowerCase())
      })
    }
  })

  function handleNewCycle() {
    router.push({ hash: '#new-cycle' })
  }

  watch(
    () => route.path,
    () => {
      fetchData()
    }
  )
</script>

<template>
  <div
    class="bg-base-100 h-screen w-[400px] border border-r-base-300 flex flex-col"
  >
    <div id="search" class="!h-16 mt-[-1px] w-full border-b border-base-300">
      <Icon
        name="search"
        size="24"
        class="absolute opacity-40 translate-x-[22px] translate-y-[18px]"
      />
      <input
        v-model="state.search"
        type="text"
        :placeholder="`Search ${context.split('-')[0]}...`"
        class="input w-full h-full rounded-none !outline-none pl-16"
      />
    </div>

    <div
      v-if="filteredData.length == 0"
      class="flex-grow w-full translate-y-[40vh]"
      :class="'flex justify-center items-center px-6'"
    >
      <p class="text-base-300 text-center text-lg">
        {{ `No ${context.split('-')[0]} found` }}
      </p>
    </div>

    <div class="h-full flex flex-col justify-between items-start">
      <ul v-if="!route.name.includes('settings')" class="w-full">
        <li v-for="(record, index) in filteredData" :key="index">
          <router-link
            :to="`/cycles/${record.id}`"
            class="font-medium h-16 w-full p-8 flex justify-start gap-4 items-center cursor-pointer hover:bg-base-200 active:bg-base-300 duration-150"
            :class="index == 0 ? 'pt-8' : ''"
          >
            <span>
              {{ record.name }}
            </span>
            <span v-if="record.active" class="badge bg-black text-white">
              Active
            </span>
            <span v-else class="badge badge-outline">Inactive</span>
          </router-link>
        </li>
      </ul>
      <ul v-else class="w-full">
        <li v-for="(record, index) in filteredData" :key="index">
          <router-link
            :to="`/settings/${record.id}`"
            class="font-medium h-16 w-full p-8 flex justify-start gap-4 items-center cursor-pointer hover:bg-base-200 active:bg-base-300 duration-150"
            :class="index == 0 ? 'pt-8' : ''"
          >
            <Icon :name="record.icon" />
            <span>
              {{ record.name }}
            </span>
          </router-link>
        </li>
      </ul>
      <div v-if="!route.name.includes('settings')" class="p-4 w-full">
        <DrawerToggle
          @click="handleNewCycle"
          for="new-cycle"
          label="New cycle"
          icon="plus"
          class="btn-outline w-full"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .router-link-exact-active,
  .router-link-active {
    background: #0000000f !important;
    border-left: solid black 2px;
    /* font-weight: bold; */
  }
</style>
