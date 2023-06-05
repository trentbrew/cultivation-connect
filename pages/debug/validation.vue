<script setup>
  const state = reactive({
    payload: {
      personal: {
        email: {
          value: '',
          valid: false,
        },
        favorite_color: {
          value: '',
          valid: false,
        },
      },
    },
  })

  function checkInvalid(group) {
    return Object.values(state.payload[group])
      .map(item => item.valid)
      .includes(false)
  }

  function handleValidation(e) {
    state.payload[e.group].valid = e.valid
  }

  function handleSubmit(context) {
    let payload = {}
    Object.keys(state.payload[context]).forEach(key => {
      if (key != 'valid') {
        payload[key] = state.payload[context][key]
      }
    })
    console.log('handling submit', payload)
  }
</script>

<template>
  <AuthRouteGuard>
    <div
      class="bg-base-200 w-full h-screen flex flex-col justify-center items-center"
    >
      <h1 class="absolute top-40 text-2xl text-primary">{{ state.value }}</h1>
      <div class="w-96">
        <Input
          v-model="state.payload.personal.email"
          group="personal"
          type="email"
          label="Email"
          name="email"
          placeholder="Input here"
          class="w-full"
          rules="required|email"
          @validation="handleValidation"
        />
        <Input
          v-model="state.payload.personal.favorite_color"
          group="personal"
          type="select"
          label="Pick your favorite color"
          name="favorite_color"
          class="w-full"
          rules="required"
          @validation="handleValidation"
        >
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </Input>
        <button
          :disabled="checkInvalid('personal')"
          class="btn mt-6 w-full"
          @click.prevent="handleSubmit('personal')"
        >
          Submit
        </button>
      </div>
    </div>
  </AuthRouteGuard>
</template>
