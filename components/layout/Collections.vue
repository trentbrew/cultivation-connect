<script setup>
  const global = useGlobalStore();
  const route = useRoute();
  const router = useRouter();
  const pb = usePocketbase();

  const context = computed(() => route.name.split('-')[0]);

  const state = reactive({
    search: '',
    data: [],
  });

  onMounted(() => {
    fetchData();
  });

  async function fetchData() {
    state.data = await pb.get(context.value, {
      filter: `facility.id = "${pb.api.authStore.model.facility}"`,
    });
  }

  function handleNewCycle() {
    router.push({ hash: '#new-cycle' });
  }
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
        type="text"
        :placeholder="`Search ${context.split('-')[0]}...`"
        class="input w-full h-full rounded-none !outline-none pl-16"
      />
    </div>

    <div
      v-if="state.data.length == 0"
      class="flex-grow w-full mt-64"
      :class="'flex justify-center items-center px-6'"
    >
      <!-- TODO: Only display this is there are no search results -->
      <p class="text-base-300 text-center text-sm">
        {{ `No ${context.split('-')[0]} found` }}
      </p>
    </div>

    <div class="h-full flex flex-col justify-between items-start">
      <ul class="w-full">
        <li v-for="(record, index) in state.data" :key="index">
          <router-link
            :to="`/cycles/${record.id}`"
            class="font-medium h-16 w-full p-8 flex justify-start items-center cursor-pointer hover:bg-base-200 active:scale-[0.96] active:rounded-[4px] duration-150"
            :class="index == 0 ? 'pt-8' : ''"
          >
            {{ record.name }}
          </router-link>
        </li>
      </ul>
      <div class="p-4 w-full">
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
    font-weight: bold;
  }
</style>
