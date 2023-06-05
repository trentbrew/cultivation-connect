<script setup>
  const api = usePocketbase()

  const state = reactive({
    payload: {
      id: '',
      hash: '',
      delete_image: '',
    },
  })

  async function updateColor() {
    console.log('updating item... ', state.payload)
    await api.update('test_data', 'nb9v3d6mhtgba7y', state.payload)
  }
</script>

<template>
  <div>
    <section class="flex flex-col gap-4">
      <input
        class="input"
        type="text"
        placeholder="id"
        v-model="state.payload.id"
      />
      <input
        class="input"
        type="text"
        placeholder="Hash"
        v-model="state.payload.hash"
      />
      <input
        type="checkbox"
        checked="checked"
        class="checkbox"
        v-model="delete_image"
      />

      <button class="btn btn-primary" @click="updateColor">update color</button>
    </section>
  </div>
</template>
