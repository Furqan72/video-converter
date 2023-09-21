<template>
  <div>
    <h3 class="flex items-center justify-start bg-[#f1f1f1f1] px-10 py-3 text-lg font-semibold text-gray-color">
      <img src="../assets/images/stamp.png" alt="" class="mr-5 h-5 w-5" />
      Watermark
    </h3>
    <div class="grid gap-8 px-10 py-7 md:grid-cols-2">
      <div class="grid grid-cols-4 justify-center text-gray-color">
        <label for="" class="mr-2 mt-2 text-15px">Watermark Image</label>
        <div class="col-span-3 flex flex-col">
          <div class="relative h-[42px] w-full cursor-pointer rounded-lg border border-[#dadadaff] text-center">
            <input @change="handleFileChange" name="waterMarkImage" accept="image/png" type="file" class="absolute bottom-0 left-0 right-0 top-0 cursor-pointer border bg-[#ccc] text-[#777] opacity-0" />
            <span class="pointer-events-none absolute left-0 min-w-[100px] rounded-r rounded-bl-none rounded-tl-none px-4 py-2">{{ fileName }}</span>
            <label class="pointer-events-none absolute right-0 w-32 rounded-r-lg border-l border-[#dadadaff] bg-[#f2f2f2ff] px-4 py-2">Browse</label>
          </div>
          <span class="mt-2 inline-flex text-xs text-light-gray">Watermark image file (PNG).</span>
          <p v-if="GlobalData.markWrongFormat" class="mt-5 text-sm text-red-600">Wrong file format. Please use png files for the waterMark.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import { useGlobalStore } from '../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

const fileName = ref('Choosen a file...');
// const markWrongFormat = ref(false);
const handleFileChange = (event) => {
  // changing name
  const nameValue = event.target.files[0];
  // console.log(nameValue);
  fileName.value = nameValue.name;
  // checking type
  if (nameValue.type !== 'image/png') {
    GlobalData.markWrongFormat = true;
  } else {
    GlobalData.markWrongFormat = false;
  }
};
</script>
