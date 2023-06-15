<script setup>
  const global = useGlobalStore();
  const route = useRoute();
  const router = useRouter();
  const pb = usePocketbase();

  const state = reactive({
    help: false,
    data: null,
  });

  async function fetchCycle() {
    const cycle = await pb.get('cycles', {
      id: route.params.cycle,
    });
    state.data = cycle;
  }

  function handleHelp() {
    state.help = !state.help;
  }

  function handleContinue() {
    router.push({ hash: '' });
  }

  onMounted(() => {
    fetchCycle();
    console.log('mounted records modal');
  });

  watch(
    () => route.hash,
    newHash => {
      if (newHash === '#records') {
        fetchCycle();
      }
    }
  );
</script>

<template>
  <div>
    <input type="checkbox" id="cycle-records" class="modal-toggle" />
    <label for="cycle-records" class="modal">
      <label for="" class="p-0 m-0">
        <div class="modal-box !border-base-200">
          <div class="w-[83vw] h-[79vh] flex justify-center items-center">
            <div
              class="flex flex-col justify-center items-center"
              v-if="!state.data?.records"
            >
              <!-- <WIP img="records" class="invert scale-[1.6] mb-8" /> -->
              <WIP
                img="records"
                class="brightness-[0.915] w-[150px] mb-12 invert"
              />
              <span
                class="mt-12 max-w-2xl text-center"
                :class="state.help && '!mt-18 opacity-40'"
              >
                Your records can be viewed and edited here. Get started by
                <br />
                uploading a
                <b>CSV file</b>
                of your grow data or manually entering your first record.
              </span>

              <span
                v-show="state.help"
                class="mt-8 max-w-xl opacity text-center"
              >
                <p>
                  <b>CSV</b>
                  stands for
                  <b>comma-separated values</b>
                  . It's a common file format for storing tabular data. You can
                  export your data from a spreadsheet program like Excel or
                  Google Sheets as a CSV file. You can always go back and view
                  or edit your records later.
                </p>
              </span>
              <div class="mt-24 flex gap-4">
                <button @click="handleHelp" class="btn btn-outline gap-2">
                  <Icon name="help" />
                  <span>{{ state.help ? 'Say less' : 'Tell me more' }}</span>
                </button>
                <label
                  for="cycle-records"
                  @click="handleContinue"
                  class="btn btn-primary gap-2"
                >
                  <Icon name="check_circle_outline" />
                  <span>I'm ready to upload</span>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-action absolute top-0 right-6">
            <label
              @click="router.push({ hash: '' })"
              for="cycle-records"
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
