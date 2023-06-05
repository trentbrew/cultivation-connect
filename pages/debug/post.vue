<script setup>
  const pb = usePocketbase()

  const state = reactive({
    payload: {
      name: '',
      rank: '',
    },
  })

  function handleFileInput(event) {
    state.payload.image = event.target.files[0]
  }

  async function postItem() {
    console.log('payload: ', state.payload)
    await pb.post('test_collection', state.payload)
  }
</script>

<template>
  <div>
    <section class="flex flex-col gap-4">
      <input
        class="input"
        type="text"
        placeholder="thing"
        v-model="state.payload.name"
      />
      <input
        type="number"
        class="input"
        placeholder="ranking (0-5)"
        min="0"
        max="5"
        v-model="state.payload.rank"
      />
      <button class="btn btn-primary" @click="postItem">post item</button>
    </section>
  </div>
</template>
