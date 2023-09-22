<template>
  <!-- Convert -->
  <div class="mt-14 flex flex-col items-center justify-center">
    <p class="mb-10 mt-5 text-center text-red-600" :class="GlobalData.errMessage === '' ? 'hidden' : 'block'">{{ GlobalData.errMessage }}</p>
    <button type="submit" class="flex w-44 items-center justify-center rounded-lg border-0 bg-[#b53836ff] bg-opacity-75 px-8 py-4 text-white outline-none duration-200 hover:bg-opacity-100 hover:shadow-xl focus:outline-none" :disabled="GlobalData.fileSizeExceeded === true || GlobalData.markWrongFormat === true">
      <ConvertIcon />
      <span>Convert</span>
    </button>
    <!-- loading -->
    <div class="flex w-full flex-col items-center justify-center py-5" :class="progressElement === 0 ? 'hidden' : 'block'">
      <div class="flex h-7 w-80 items-center rounded-full bg-gray-200 px-3 shadow-lg duration-300">
        <p class="h-[14px] w-0 rounded-full text-center duration-500" :class="progressElement !== 100 ? 'bg-[#b53836ff]' : 'bg-green-500'" :style="{ width: progressElement + '%' }"></p>
      </div>
      <span class="mt-2 font-semibold duration-300" :class="progressElement !== 100 ? 'text-black' : 'text-green-500'">{{ progressElement !== 100 ? 'Converting' : 'Conversion Complete' }} </span>
    </div>
    <!-- Convert -->
    <a @click="downloadClick()" :target="GlobalData.selectedFormat === '.webm' ? '_blank' : ''" :href="GlobalData.downloadUrlFromNode" id="downloadBtn" :download="GlobalData.downloadName" class="mt-3 flex w-44 rounded-lg border-0 bg-green-500 bg-opacity-75 px-8 py-4 text-white outline-none duration-200 hover:bg-opacity-100 hover:text-white hover:shadow-xl focus:outline-none" :class="[progressElement === 100 ? 'flex' : 'hidden', progressElement !== 100 ? 'pointer-events-none' : 'cursor-pointer']">
      <DownloadIcon />
      Download</a
    >
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import io from 'socket.io-client';
// icons
import DownloadIcon from '../../src/assets/icons/DownloadIcon.vue';
import ConvertIcon from '../../src/assets/icons/ConvertIcon.vue';
// global store
import { useGlobalStore } from '../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

const showConvertButton = ref(true);
const downloadClick = () => {
  if (showConvertButton === true) {
    showConvertButton.value = !showConvertButton.value;
  }
};

//  response from the socket.io (provides duration of converting the file from the server)
const progressElement = ref(0);
const socket = io('http://localhost:4000');
onMounted(() => {
  // socket.on('message', (message) => {
  // console.log('Received message from server:', message);
  // });
  socket.on('progress', (progressPercent) => {
    // console.log('Progress:', progressPercent);
    progressElement.value = progressPercent;
  });
});
</script>
