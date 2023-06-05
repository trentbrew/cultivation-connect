<script setup>
  const global = useGlobalStore();
  const router = useRouter();
  const route = useRoute();

  const state = reactive({
    value: 0, // ie. 72
    avg: 0, // ie. 83.25
    min: 0, // ie. 35
    max: 0, // ie. 138
    range: {},
  });

  const context = computed(() => global.getDetailsContext);
  const hash = computed(() => route.hash);

  // TODO: Fetch data from API

  onMounted(() => {
    state.range = global.getRange(context.value);
  });

  function calculateMetrics(data) {
    let avg, min, max;
    console.log('calculating metrics for: ', data);
    // TODO: caluculate avg
    // TODO: caluculate min
    // TODO: calculate max
  }

  watch(
    () => hash.value,
    newVal => {
      console.log('hash updated: ', newVal);
      if (newVal) {
        // TODO: go to details page
      }
      if (!newVal) {
        // TODO: go to cycles page
      }
    }
  );
</script>

<template>
  <div class="w-full h-full">
    <div class="absolute ml-4">
      <nuxt-link
        @click.prevent="back"
        class="my-2 ml-4 flex gap-3 group cursor-pointer"
      >
        <Icon name="arrow_left" class="group-hover:translate-x-[-8px] pb-2" />
        <span>Back</span>
      </nuxt-link>
      <div class="ml-4 font-bold text-2xl mb-3">
        {{ state.range.title ?? '' }}
      </div>
    </div>
    <div class="w-full h-full pt-24">
      <div class="w-full h-full p-4 flex gap-4">
        <div
          class="h-full w-fit flex flex-col gap-4 justify-between items-start rounded"
        >
          <span class="absolute m-2 mx-3">Last recorded</span>
          <div
            class="bg-base-100 border border-base-300 flex-grow flex justify-center items-center flex-col rounded-[8px]"
          >
            <div class="absolute">
              <Pill
                :id="hash.substring(1)"
                :value="state.value"
                :unit="state.range?.unit"
                class="translate-y-28"
              />
            </div>
            <div class="w-96 h-[300px] flex justify-center items-center">
              <Gauge :context="context" :value="state.value" />
            </div>
          </div>
          <div class="h-fit w-96 flex flex-col gap-4">
            <div
              class="bg-base-100 border border-base-300 w-full h-32 rounded-[8px] p-2 px-3 flex flex-col justify-between items-start"
            >
              <span>Avg</span>
              <h2 class="text-3xl font-bold mb-3">
                <span>
                  {{
                    state.range?.unit == '%'
                      ? Number.isInteger(state.avg * 100)
                        ? state.avg * 100
                        : (state.avg * 100).toFixed(2)
                      : state.avg
                  }}
                </span>
                <span class="text-sm ml-1">{{ state.range.unit ?? '' }}</span>
              </h2>
            </div>
            <div class="flex gap-4 w-full">
              <div
                class="w-full h-32 bg-base-100 border border-base-300 rounded-[8px] p-2 px-3 flex flex-col justify-between items-start"
              >
                <span>Min</span>
                <h2 class="text-3xl font-bold mb-3">
                  <span>
                    {{
                      state.range?.unit == '%'
                        ? Number.isInteger(state.min * 100)
                          ? state.min * 100
                          : (state.min * 100).toFixed(2)
                        : state.min
                    }}
                  </span>
                  <span class="text-sm ml-1">{{ state.range.unit ?? '' }}</span>
                </h2>
              </div>
              <div
                class="w-full h-32 bg-base-100 border border-base-300 rounded-[8px] p-2 px-3 flex flex-col justify-between items-start"
              >
                <span>Max</span>
                <h2 class="text-3xl font-bold mb-3">
                  <span>
                    {{
                      state.range?.unit == '%'
                        ? Number.isInteger(state.max * 100)
                          ? state.max * 100
                          : (state.max * 100).toFixed(2)
                        : state.max
                    }}
                  </span>
                  <span class="text-sm ml-1">{{ state.range?.unit }}</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full h-full border border-base-300 rounded p-4">
          <LineGraph :context="context" :value="32" />
        </div>
      </div>
    </div>
  </div>
</template>
