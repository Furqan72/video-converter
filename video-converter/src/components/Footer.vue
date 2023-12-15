<template>
  <div class="bg-[#f2f2f2] px-28 py-14">
    <div class="grid grid-cols-10">
      <div v-for="(list, index) in lists" :key="index" class="mx-4">
        <p class="pb-3 font-semibold text-black">{{ list.listName }}</p>
        <ul class="text-[#b53836] [&>*]:py-1">
          <li>{{ list.listContent[0].name1 }}</li>
          <li>{{ list.listContent[0].name2 }}</li>
        </ul>
      </div>
      <div class="col-span-6 text-end">
        <p>Lorem, ipsum dolor amet.</p>
        <p class="text-gray-400">Lorem ipsum dolor consectetur.</p>
      </div>
    </div>
    <p class="mb-10 mt-14 text-center text-2xl font-semibold text-gray-400">We've already converted <span class="font-bold text-gray-500">1,672,395,206 files</span> with a total size of <span class="font-bold text-gray-500">12,972 TB.</span></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const lists = ref([
  {
    listName: 'Company',
    listContent: [
      {
        name1: 'About Us',
        name2: 'Security',
      },
    ],
  },
  {
    listName: 'Resources',
    listContent: [
      {
        name1: 'Blog',
        name2: 'Status',
      },
    ],
  },
  {
    listName: 'Legal',
    listContent: [
      {
        name1: 'Privacy',
        name2: 'Terms',
      },
    ],
  },
  {
    listName: 'Contact',
    listContent: [
      {
        name1: 'Contact Us',
        name2: 'Imprint',
      },
    ],
  },
]);
</script>
