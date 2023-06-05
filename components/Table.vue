<script setup>
  const props = defineProps({
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
  });

  const keys = computed(() => {
    if (props.data.length > 0) {
      return props.data.reduce((acc, item) => {
        return Object.keys(item).reduce((acc, key) => {
          if (!acc.includes(key)) acc.push(key);
          return acc;
        }, acc);
      }, []);
    } else {
      return props.placeholderColumns;
    }
  });

  const data = computed(() => Array.from(props.data).map(item => keys.value.map(key => item[key])));
</script>

<template>
  <div class="w-full overflow-x-auto rounded border border-base-300 z-[0]">
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
        <tr v-for="(item, itemIndex) in data" :key="itemIndex" class="hover cursor-pointer !duration-150">
          <th class="font-normal text-base-300">{{ itemIndex }}</th>
          <td v-for="(datum, datumIndex) in Object.entries(item)" :key="datumIndex">
            {{ datum[1] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
