<script setup>
  const api = usePocketbase()

  const state = reactive({
    id: '',
  })

  async function deleteColor() {
    console.log('deleting item...', state.id)
    await api.delete('test_data', state.id)
  }
</script>

<template>
  <div>
    <section class="flex flex-col gap-4">
      <input class="input" type="text" placeholder="id" v-model="state.id" />
      <button class="btn btn-primary" @click="deleteColor">delete color</button>
    </section>
  </div>
</template>
