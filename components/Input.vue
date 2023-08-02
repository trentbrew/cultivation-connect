<script setup>
  const global = useGlobalStore()

  const props = defineProps([
    'nolabel',
    'modelValue',
    'class',
    'type',
    'group',
    'id',
    'name',
    'value',
    'label',
    'placeholder',
    'dynamicPlaceholder',
    'min',
    'max',
    'rows',
    'cols',
    'rules',
    'autofill',
    'checked',
    'selected',
    'disabled',
    'accept',
    'dynamic',
  ])

  const select = ref(null)

  const emit = defineEmits([
    'update:modelValue',
    'validation',
    'input',
    'change',
    'addItem',
  ])

  const state = reactive({
    loading: false,
    add: false,
    dynamicValue: '',
    class: {
      label: '',
      input: '',
    },
    rules: [],
  })

  onMounted(() => {
    validate()
  })

  const types = ['text', 'number', 'date', 'time', 'email', 'password']

  const validators = {
    required: () => {
      if (
        props.modelValue &&
        props.modelValue != '' &&
        props.modelValue.length > 0
      )
        return true
      return false
    },
    email: () => {
      const regex = /\S+@\S+\.\S+/
      if (regex.test(props.modelValue)) return true
      return false
    },
    zipcode: () => {
      const regex = /^\d{5}(?:[-\s]\d{4})?$/
      if (regex.test(props.modelValue)) return true
      return false
    },
    min: value => {
      if (props.modelValue >= value) return true
      return false
    },
    max: value => {
      if (props.modelValue <= value) return true
      return false
    },
    minLength: value => {
      if (props.modelValue.length >= value) return true
      return false
    },
    maxLength: value => {
      if (props.modelValue.length <= value) return true
      return false
    },
  }

  function validation() {
    let checks = []
    let messages = []
    let failed = []
    if (props.rules) {
      const rules = props.rules.split('|')
      state.rules = rules
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i]
        if (rule.includes(':')) {
          const [name, value] = rule.split(':')
          if (!validators[name](value)) {
            checks.push(false)
            if (!failed.includes(name)) failed.push(name)
            if (name == 'min' || name == 'max') {
              messages.push(`Value is out of range`)
            }
            if (name == 'minLength') {
              messages.push(
                `${props.label || 'Value'} must be at least ${value} characters`
              )
            }
            if (name == 'maxLength') {
              messages.push(
                `${
                  props.label || 'Value'
                } must be less than ${value} characters`
              )
            }
          } else {
            checks.push(true)
          }
        } else {
          if (!validators[rule]()) {
            checks.push(false)
            if (!failed.includes(rule)) failed.push(rule)
            if (rule == 'required') {
              messages.push(`${props.label || 'Value'} field is required`)
            }
            if (rule == 'email') {
              messages.push(`Email address is invalid`)
            }
            if (rule == 'zipcode') {
              messages.push(`Zipcode is invalid`)
            }
          } else {
            checks.push(true)
          }
        }
      }
      return {
        valid: !checks.includes(false),
        message: messages.join(', '),
        rules: failed,
      }
    }
    return {
      valid: true,
      message: '',
      rules: [],
    }
  }

  function validate() {
    let inputClass = ''
    let labelClass = ''
    const v = validation()
    if (!v.valid) {
      if (types.includes(props.type) || props.type == 'textarea') {
        inputClass = ' input-error'
        labelClass = ' text-error'
      }
      if (props.type == 'select') {
        inputClass = ' select-error'
        labelClass = ' text-error'
      }
    } else {
      inputClass = ''
      labelClass = ''
    }
    state.valid = v.valid
    state.class.input = props.class + inputClass
    state.class.label = labelClass
    emit('validation', {
      valid: v.valid,
      message: v.message,
      rules: v.rules,
      group: props.group,
      id: props.id,
    })
  }

  function handleInput(e) {
    // console.log('handling input: ', e);
    if (props.dynamic === '') {
      if (e.target.value == '+') {
        state.add = true
      } else {
        if (e.target.id != 'dynamic') {
          state.add = false
        } else {
          state.dynamicValue = e.target.value
        }
        emit('input', e)
        emit('update:modelValue', e.target.value)
      }
    } else {
      emit('input', e)
      emit(
        'update:modelValue',
        props.type == 'file' ? e.target.files : e.target.value
      )
      // console.log('update:modelValue', props.type == 'file' ? e.target.files : e.target.value);
    }
  }

  function handleCancel() {
    state.add = false
  }

  function handleSubmit(e) {
    if (state.dynamicValue == '' || !state.dynamicValue) {
      global.toast('warning', `New ${props.label} cannot be blank`)
    } else {
      console.log('adding item', e)
      emit('addItem', {
        group: props.group,
        id: props.id,
        value: state.dynamicValue,
      })
      state.add = false
      var opts = select.value?.getElementsByTagName('option')
      opts[0].selected = true
      state.loading = true
      setTimeout(() => {
        state.loading = false
        let names = Array.from(opts).map(el => el.innerHTML)
        console.log('names', names)
        console.log(
          'opts[names.indexOf(state.dynamicValue)]',
          opts[names.indexOf(state.dynamicValue)]
        )
        console.log(
          'selecting the new option...',
          opts[names.indexOf(state.dynamicValue)]
        )
        opts[names.indexOf(state.dynamicValue)].selected = true
      }, 2500)
    }
  }

  watch(
    () => props.modelValue,
    () => {
      validate()
    }
  )
</script>

<template>
  <!-- Input -->
  <div
    v-if="types.includes(props.type)"
    class="flex flex-col items-start gap-2 mt-3"
  >
    <label v-show="!props.nolabel" :class="props.disabled ? 'opacity-50' : ''">
      {{ `${props.label} ${state.rules.includes('required') ? '*' : ''}` }}
    </label>
    <input
      @input="handleInput"
      :value="
        props.dynamic && props.placeholder ? props.value : props.modelValue
      "
      class="input bg-base-200/50"
      :class="state.class.input"
      :type="props.type"
      :placeholder="props.placeholder"
      :min="props.min"
      :max="props.max"
      :autofill="props.autofill"
      :disabled="props.disabled"
    />
  </div>
  <!-- Select -->
  <div
    v-if="props.type == 'select'"
    class="flex flex-col items-start gap-2"
    :class="!props.nolabel ? 'mt-3' : ''"
  >
    <label
      v-show="!props.nolabel"
      class="w-full flex justify-between"
      :class="props.disabled ? 'opacity-50' : ''"
    >
      <span>
        {{ `${props.label} ${state.rules.includes('required') ? '*' : ''}` }}
      </span>
      <span>
        {{ `${state.loading ? '' : ''}` }}
      </span>
    </label>
    <div class="w-full flex">
      <select
        ref="select"
        @input="handleInput"
        :value="props.placeholder ? props.placeholder : props.modelValue"
        @change="$emit('change', $event)"
        class="select bg-base-200/50 flex-shrink"
        :class="state.class.input + (state.add ? ' hidden' : '')"
        :autofill="props.autofill"
        :selected="props.selected"
        :disabled="props.disabled"
      >
        <option
          value=""
          selected
          :disabled="!props.dynamic && props.dyanmic !== ''"
        >
          {{ '---' }}
        </option>
        <option v-if="props.dynamic === '' && !state.add" value="+">
          {{
            props.dynamicPlaceholder ??
            `+ Add a new ${props.label.toLowerCase()}`
          }}
        </option>
        <slot />
      </select>
      <div v-if="state.add" class="flex w-full items-center">
        <input
          ref="dynamic"
          id="dynamic"
          @input="handleInput"
          type="text"
          :placeholder="`New ${props.label.toLowerCase()}`"
          class="input border-none bg-base-200/50 w-full pr-44"
        />
        <div class="absolute right-10 flex gap-2 ml-2">
          <button @click.prevent="handleCancel" class="btn btn-sm btn-ghost">
            Cancel
          </button>
          <button @click.prevent="handleSubmit" class="btn btn-sm btn-primary">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- TextArea -->
  <div
    v-if="props.type == 'textarea'"
    class="flex flex-col items-start gap-2 mt-4"
  >
    <label v-show="!props.nolabel" :class="props.disabled ? 'opacity-50' : ''">
      {{ `${props.label} ${state.rules.includes('required') ? '*' : ''}` }}
    </label>
    <textarea
      @input="handleInput"
      class="input bg-base-200/50 pt-3"
      :class="state.class.input"
      :value="props.placeholder ? props.placeholder : props.modelValue"
      :placeholder="props.placeholder"
      :rows="props.rows"
      :cols="props.cols"
      :autofill="props.autofill"
      :disabled="props.disabled"
    />
  </div>
  <!-- Radio Group -->
  <div v-if="props.type == 'radio'" class="flex items-center gap-3">
    <input
      @input="handleInput"
      type="radio"
      class="radio"
      :class="state.class.input"
      :value="props.value"
      :id="props.id"
      :name="props.name"
      :autofill="props.autofill"
      :checked="props.checked"
      :disabled="props.disabled"
    />
    <label :for="props.id">
      {{ `${props.label} ${state.rules.includes('required') ? '*' : ''}` }}
    </label>
  </div>
  <!-- Checkbox Group -->
  <div v-if="props.type == 'checkbox'" class="flex items-center gap-3">
    <input
      @input="handleInput"
      type="radio"
      class="checkbox"
      :class="state.class.input"
      :value="props.value"
      :id="props.id"
      :name="props.name"
      :autofill="props.autofill"
      :checked="props.checked"
      :disabled="props.disabled"
    />
    <label :for="props.id" :class="props.disabled ? 'opacity-50' : ''">
      {{ `${props.label} ${state.rules.includes('required') ? '*' : ''}` }}
    </label>
  </div>
  <!-- File -->
  <div
    v-if="props.type == 'file'"
    class="form-control flex flex-col items-start gap-2 mt-3"
  >
    <label :class="props.disabled ? 'opacity-50' : ''">
      {{ `${props.label} ${state.rules.includes('required') ? '*' : ''}` }}
    </label>
    <input
      type="file"
      class="file-input file-input-bordered w-full"
      :class="state.class.input"
      @input="handleInput"
      :disabled="props.disabled"
      :accept="props.accept"
    />
  </div>
</template>
