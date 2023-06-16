<script setup>
  const global = useGlobalStore();
  const route = useRoute();
  const router = useRouter();
  const pb = usePocketbase();

  const state = reactive({
    context: '',
    data: null, // TODO: use cycle.readings
    latest_value: 72, // ie. 72
    avg: 83.25, // ie. 83.25
    min: 35, // ie. 35
    max: 138, // ie. 138
    range: null,
  });

  async function fetchCycle() {
    const cycle = await pb.get('cycles', {
      id: route.params.cycle,
    });
    state.data = cycle;
  }

  function calculateMetrics(data) {
    let avg, min, max;
    // TODO: caluculate avg
    // TODO: caluculate min
    // TODO: calculate max
  }

  onMounted(() => {
    fetchCycle();
  });

  watch(
    () => route.hash,
    newHash => {
      if (
        newHash &&
        newHash !== '#records' &&
        newHash.split('–')[0] !== '#edit'
      ) {
        fetchCycle();
        state.context = newHash.substring(1);
        state.range = global.getRange(newHash.substring(1));
      }
    }
  );
</script>

<template>
  <div v-if="state.data && state.range">
    <input type="checkbox" id="details" class="modal-toggle" />
    <label for="details" class="modal">
      <label for="" class="p-0 m-0">
        <div class="modal-box !border-base-200">
          <div class="w-[83vw] h-[79vh]">
            <div class="w-full h-full">
              <div class="absolute ml-4">
                <div class="ml-4 text-2xl mt-6">
                  {{ state.range?.title ?? '' }}
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
                          :id="state.context"
                          :value="state.latest_value"
                          :unit="state.range?.unit"
                          class="translate-y-28"
                        />
                      </div>
                      <div
                        class="w-96 h-[300px] flex justify-center items-center"
                      >
                        <!-- <Gauge :context="state.context" :value="state.value" /> -->
                      </div>
                    </div>
                    <div class="h-fit w-96 flex flex-col gap-4">
                      <div
                        class="bg-base-100 border border-base-300 w-full h-32 rounded-[8px] p-2 px-3 flex flex-col justify-between items-start"
                      >
                        <span>Avg</span>
                        <h2 class="text-3xl mb-3">
                          <span>
                            {{
                              state.range?.unit == '%'
                                ? Number.isInteger(state.avg * 100)
                                  ? state.avg * 100
                                  : (state.avg * 100).toFixed(2)
                                : state.avg
                            }}
                          </span>
                          <span class="text-sm ml-1">
                            {{ state.range.unit ?? '' }}
                          </span>
                        </h2>
                      </div>
                      <div class="flex gap-4 w-full">
                        <div
                          class="w-full h-32 bg-base-100 border border-base-300 rounded-[8px] p-2 px-3 flex flex-col justify-between items-start"
                        >
                          <span>Min</span>
                          <h2 class="text-3xl mb-3">
                            <span>
                              {{
                                state.range?.unit == '%'
                                  ? Number.isInteger(state.min * 100)
                                    ? state.min * 100
                                    : (state.min * 100).toFixed(2)
                                  : state.min
                              }}
                            </span>
                            <span class="text-sm ml-1">
                              {{ state.range.unit ?? '' }}
                            </span>
                          </h2>
                        </div>
                        <div
                          class="w-full h-32 bg-base-100 border border-base-300 rounded-[8px] p-2 px-3 flex flex-col justify-between items-start"
                        >
                          <span>Max</span>
                          <h2 class="text-3xl mb-3">
                            <span>
                              {{
                                state.range?.unit == '%'
                                  ? Number.isInteger(state.max * 100)
                                    ? state.max * 100
                                    : (state.max * 100).toFixed(2)
                                  : state.max
                              }}
                            </span>
                            <span class="text-sm ml-1">
                              {{ state.range?.unit }}
                            </span>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="w-full h-full border border-base-300 rounded p-4">
                    <!-- <LineGraph :context="state.context" :value="32" /> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-action absolute top-0 right-6">
            <label
              @click="router.push({ hash: '' })"
              for="details"
              class="btn btn-ghost btn-circle"
            >
              <Icon name="close" />
            </label>
          </div>
        </div>
      </label>
    </label>
  </div>
</template>
