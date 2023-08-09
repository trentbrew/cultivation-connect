<script setup>
  const global = useGlobalStore()
  const router = useRouter()

  const props = defineProps({
    drawer: {
      type: Boolean,
      default: false,
    },
    for: {
      type: String,
      required: true,
    },
    missing: {
      type: Array,
      default: () => [],
    },
    hoverable: {
      type: Boolean,
      default: true,
    },
    placeholderColumns: {
      type: Array,
      default: () => ['Name', 'Age', 'Country'],
    },
    data: {
      type: [Object, Array],
      default: () => [
        {
          name: 'John Doe',
          age: 30,
          country: 'USA',
        },
        {
          name: 'Jane Doe',
          age: 25,
          country: 'Canada',
        },
        {
          name: 'Sammy Doe',
          age: 18,
          country: 'Mexico',
        },
      ],
    },
  })

  const state = reactive({
    form: {
      precycle: {
        start_date: {
          type: 'date',
          value: '',
        },
        zone: {
          type: 'select',
          value: '',
          options: [],
        },
        growth_stage: {
          type: 'select',
          value: '',
          options: [],
        },
        cultivar: {
          type: 'select',
          value: '',
          options: [],
        },
        room: {
          type: 'select',
          value: '',
          options: [],
        },
        plants: {
          type: 'number',
          value: '',
        },
        substrate: {
          type: 'select',
          value: '',
          option: [
            ['Soil', 'soil'],
            ['Coco coir', 'coco_coir'],
            ['Rockwool', 'rockwool'],
            ['Perlite', 'perlite'],
            ['Vermiculite', 'vermiculite'],
            ['Peat moss', 'peat_moss'],
            ['Perlite / Coco coir', 'perlite_coco_coir'],
            ['Perlite / Vermiculite', 'perlite_vermiculite'],
            ['Peat moss / Soilless', 'peat_moss'],
            ['Soilless', 'soilless'],
          ],
        },
        nutrients_type: {
          type: 'select',
          value: '',
          options: [
            ['Commercial brand', 'organic'],
            ['Custom blend', 'inorganic'],
          ],
        },
        root_zone_style: {
          type: 'select',
          value: '',
          option: [
            ['Individual pot / planter', 'planter'],
            ['Vertical', 'vertical'],
            ['Soil bed', 'soil_bed'],
          ],
        },
      },
    },
  })

  const keys = computed(() => {
    if (props.data.length > 0) {
      return props.data.reduce((acc, item) => {
        return Object.keys(item).reduce((acc, key) => {
          if (!acc.includes(key)) acc.push(key)
          return acc
        }, acc)
      }, [])
    } else {
      return props.placeholderColumns
    }
  })

  const data = computed(() =>
    Array.from(props.data).map(item => keys.value.map(key => item[key]))
  )

  function handleDrawerToggle(item) {
    console.log('hadling drawer toggle: ', item)
    router.push({ hash: `#${props.for}` })
    global.setDrawerContext(props.for)
    // global.setCurrentItem(item) // for editing
  }
</script>

<template>
  <div class="w-full overflow-auto border border-base-300 z-[0] rounded-[16px]">
    <table class="table w-full">
      <thead>
        <tr>
          <th class="text-base-content">#</th>
          <th v-for="(key, keyIndex) in keys" :key="keyIndex">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="!props.drawer"
          v-for="(item, itemIndex) in data"
          :key="itemIndex"
          class="cursor-pointer !duration-150"
          :class="props.hoverable ? 'hover' : ''"
        >
          <th class="font-normal">{{ itemIndex + 1 }}</th>
          <td
            v-for="(datum, datumIndex) in Object.entries(item)"
            :key="datumIndex"
          >
            {{ datum[1] }}
          </td>
        </tr>
        <tr
          v-else
          v-for="(item, index) in data"
          :key="index"
          class="w-full h-full hover"
        >
          <th class="font-normal">{{ index + 1 }}</th>
          <td
            v-for="(datum, datumIndex) in Object.entries(item)"
            :key="datumIndex"
            class="h-full cursor-pointer !rounded-none"
            @click="handleDrawerToggle(item)"
            :class="datum[1] === '---' ? '' : ''"
          >
            <label
              class="!rounded-none"
              for="drawer"
              @click="handleDrawerToggle"
            >
              {{ datum[1] }}
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
