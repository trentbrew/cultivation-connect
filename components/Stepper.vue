<script setup>
  const props = defineProps({
    steps: {
      type: Array,
      default: [
        {
          title: 'Step One',
          name: 'step1',
          status: 'complete',
        },
        {
          title: 'Step Two',
          name: 'step2',
          status: 'active',
        },
        {
          title: 'Step Three',
          name: 'step3',
          status: 'incomplete',
        },
        {
          title: 'Step Four',
          name: 'step4',
          status: 'incomplete',
        },
      ],
    },
  })

  const styles = {
    complete: 'step step-primary',
    active: 'step step-primary font-bold active-step',
    incomplete: 'step text-base-content/50',
  }
</script>

<template>
  <div>
    <ul class="steps w-full">
      <li
        v-for="(step, index) in props.steps"
        :key="index"
        :class="styles[step.status]"
        class="duration-[300ms]"
      >
        {{ step.title }}
      </li>
    </ul>
  </div>
</template>
