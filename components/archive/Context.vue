<script setup>
  const global = useGlobalStore()
  const pb = usePocketbase()

  const state = reactive({
    ready: false,
  })

  function handleModalToggle(e) {
    console.log('modal open?:', e.target.checked)
    if (e.target.checked) state.ready = true
  }
</script>

<template>
  <div>
    <input
      @change="handleModalToggle"
      type="checkbox"
      id="context"
      class="modal-toggle"
    />
    <label for="context" class="modal sm:modal-middle !bg-white/40">
      <label for="" class="p-0 m-0">
        <div>
          <div class="flex h-[calc(50vh-64px)]">
            <div class="p-8">
              <Gauge v-if="state.ready" class="w-96 h-full" />
            </div>
            <LineGraph
              v-if="state.ready"
              class="w-[50vw] h-[75%] bg-transparent translate-y-8"
            />
          </div>
          <div
            class="bg-white w-full h-80 border border-base-200 rounded flex justify-center items-center p-8"
          ></div>
        </div>
      </label>
    </label>
  </div>
</template>
