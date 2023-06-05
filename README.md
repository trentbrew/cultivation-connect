<b>Cultivation Connect</b> is a framework for monitoring and managing crop growth through predictive insights, data visualization, and tools for controlling various environmental factors that impact your crops.

# Installation

---

1. Clone the repository

- `git clone <https://github.com/trentbrew/cultivation-connect>`

2. Install dependencies

- `npm install`

3. Run locally

- `npm run dev`

# Supporting Files

---

[Crop Steering Framework](https://docs.google.com/spreadsheets/d/1UrczPzwDfpn8adnigQRyj91C---KBomb/edit#gid=1646154042)

- This file is a table that outlines a cultivation framework for growing crops. It is designed to steer the growth of crops through different stages of growth. The framework is divided into growth stages, and each stage has a set of metrics, sensors, ranges, and scores that are used to monitor and adjust the environment for the crops.
- The growth stages mentioned in the chart are: propagation, early vegetative, late vegetative, flower week 1-3, flower week 4-6, ripening week 7-8, flush, and harvest. The legend explains that the metrics listed in the chart are unique to each stage.
- The metrics listed for each growth stage include: daytime air temperature, nighttime air temperature, daytime relative humidity, nighttime relative humidity, vapor pressure deficit (VPD), and solar/PPFD. The table lists the ideal ranges for each metric and assigns a score to each range. The scores range from 0 to 3, with 3 being the ideal range for each metric.
- This data lives on the backend and can be found in the PocketBase table called ranges.

[New User Intake Form](https://docs.google.com/spreadsheets/d/1Xv88-DMgduCKjuhtsI2eKdPf0c98DC0cPz0JifbU4PA/edit#gid=0)

- This file outlines the onboarding process for new users. The data collected during this step is integral for providing accurate insights for the user’s specific situation.
- The onboarding intake form can be found in ~/pages/intake.vue.

# Style Guide

---

## Composition API

The Composition API is a new feature in Vue.js 3 that allows developers to organize the code for their Vue.js components into smaller, more manageable units.

## Block ordering

Single-file components are ordered by `<script>`, `<template>`, then `<style>`.

## Ref vs Reactive

reactive() should be used to initialize reactive state within components. Likewise, props and emits should not be initialized anonymously to avoid naming collisions in the template:

```js
// --- Parent.vue ---

<template>
  <Child val="Hello" />
</template>

// --- Child.vue ---

<script>
	const props = defineProps({
    val: String
  })
  const state = reactive({
    val: 'world'
  })
</script>

<template>
	<span>{{ props.val }} {{ state.val }}</span>
</template>

// --- Output ---

Hello world
```

`ref` should only be used to initialize and directly interact with DOM elements:

```js
// --- Index.vue ---

<script>
  const myInput = ref(null)

  onMounted(() => {
    getElementWidth(myInput.value)
  })

  function getElementWidth(element) {
	  console.log(element.style.width)
  }
</script>

<template>
  <div ref="myInput" class="myDiv" />
</template>

<style>
  .myDiv {
    width: 120px;
    height: 100px;
    background-color: blue;
  }
</style>

// --- Output ---

120px
```

## Linting & Formatting

Prettier is used to enforce a consistent coding style and detect and fix code issues. The prettier configuration can be found in ~/prettierrc.

## Commit Messages

- genesis: Initial commit
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- nudge: An ever-so-tiny update
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests
- chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

# APIs

---

🚧

# Deployment

---

🚧

# Testing

---

🚧

# Resources

---

🚧

# License

---

🚧
