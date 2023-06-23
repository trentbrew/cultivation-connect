<script setup>
  const pb = usePocketbase()
  const global = useGlobalStore()
  const router = useRouter()

  const state = reactive({
    loading: false,
    data: {
      facility: null,
      rooms: null,
      zones: null,
      sensors: null,
      cultivars: null,
      cycles: null,
      records: null,
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
    state.loading = false
    console.log('state.data: ', state.data)
  })

  const greet = computed(() => {
    const now = new Date()
    const hour = now.getHours()
    const name = pb.api.authStore.model.first_name
    if (hour < 12) return `Good morning, ${name}!`
    else if (hour < 18) return `Good afternoon, ${name}!`
    else return `Good evening, ${name}!`
  })
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
          <button class="btn btn-outline gap-3">
            <Icon name="edit" />
            <span>Edit facility details</span>
          </button>
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
            <!-- CYCLE CONDITIONS -->
            <div
              class="w-full h-[60vh] rounded-[8px] p-4 border-[1px] border-base-300"
            >
              <MultiLineGraph />
            </div>
            <!-- ROOMS & ZONES -->
            <div class="flex gap-4 h-full">
              <div
                class="w-full h-96 border-[1px] border-base-300 rounded-[8px] p-4 bg-base-100"
              ></div>
              <div
                class="w-full h-96 border-[1px] border-base-300 rounded-[8px] p-4 bg-base-100"
              ></div>
            </div>
            <!-- CULTIVARS & SENSORS -->
            <div class="flex gap-4 h-full">
              <div
                class="w-full h-96 border-[1px] border-base-300 rounded-[8px] p-4 bg-base-100"
              ></div>
              <div
                class="w-full h-96 border-[1px] border-base-300 rounded-[8px] p-4 bg-base-100"
              ></div>
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
