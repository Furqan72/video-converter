<template>
  <!-- Convert -->
  <div class="mt-14 flex flex-col items-center justify-center">
    <p class="my-5 text-center text-red-600" v-if="GlobalData.errMessage">{{ GlobalData.errMessage }}</p>
    <button type="submit" class="flex w-44 items-center justify-center rounded-lg border-0 bg-[#b53836ff] bg-opacity-75 px-8 py-4 text-white outline-none duration-200 hover:bg-opacity-100 hover:shadow-xl focus:outline-none" :disabled="GlobalData.fileSizeExceeded === true || GlobalData.markWrongFormat === true || GlobalData.formatCheck === true || GlobalData.selectedFormat === '...' || GlobalData.selectedFileFormat === '...'">
      <ConvertIcon />
      <span>Convert</span>
    </button>
    <!-- loading -->
    <div class="flex w-full flex-col items-center justify-center py-5" v-if="progressElement !== 0">
      <div class="mt-5 flex h-8 w-96 items-center rounded-full bg-gray-200 px-3 shadow-lg">
        <p class="h-4 w-0 rounded-full duration-500" :class="progressElement !== 100 ? 'progress-bar bg-[#C74543]' : ' bg-green-500'" :style="{ width: progressElement + '%' }"></p>
      </div>

      <div class="mt-2 flex items-center justify-center">
        <span class="mr-2 block font-semibold duration-300" :class="progressElement !== 100 ? 'text-black' : 'text-green-500'">{{ progressElement !== 100 ? 'Converting' : 'Conversion Complete' }} </span>
        <div class="flex justify-center" v-if="progressElement !== 100">
          <div class="pulse-bubble-1 mx-[2px] h-1 w-1 rounded-full bg-black"></div>
          <div class="pulse-bubble-2 mx-[2px] h-1 w-1 rounded-full bg-black"></div>
          <div class="pulse-bubble-3 mx-[2px] h-1 w-1 rounded-full bg-black"></div>
        </div>
      </div>
    </div>
    <!-- Download -->
    <a @click="downloadClick()" :target="GlobalData.selectedFormat === '.webm' || GlobalData.selectedFormat === '.mp4' || GlobalData.selectedFormat === '.3gp' ? '_blank' : ''" :href="GlobalData.downloadUrlFromNode" id="downloadBtn" :download="GlobalData.downloadName" class="mt-3 flex w-44 rounded-lg border-0 bg-green-500 bg-opacity-75 px-8 py-4 text-white outline-none duration-200 hover:bg-opacity-100 hover:text-white hover:shadow-xl focus:outline-none" :class="[progressElement === 100 ? 'flex' : 'hidden', progressElement !== 100 ? 'pointer-events-none' : 'cursor-pointer']">
      <DownloadIcon />
      Download</a
    >
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import io from 'socket.io-client';
// icons
import DownloadIcon from '../../../src/assets/icons/DownloadIcon.vue';
import ConvertIcon from '../../../src/assets/icons/ConvertIcon.vue';
// global store
import { useGlobalStore } from '../../../src/Store/GlobalStore.js';

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
  socket.on('message', (message) => {
    console.log('Received message from server:', message);
    GlobalData.errMessage = message;
  });
  socket.on('errMessage', (errorMessage) => {
    console.log('Received message from server:', errorMessage);
    GlobalData.errMessage = errorMessage;
  });
  socket.on('progress', (progressPercent) => {
    // console.log('Progress:', progressPercent);
    progressElement.value = progressPercent;
  });
});
</script>

<style scoped>
@keyframes pulse {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0.25;
    transform: scale(0.75);
  }
}

.pulse-bubble-1 {
  animation: pulse 0.4s ease 0s infinite alternate;
}
.pulse-bubble-2 {
  animation: pulse 0.4s ease 0.2s infinite alternate;
}
.pulse-bubble-3 {
  animation: pulse 0.4s ease 0.4s infinite alternate;
}

.progress-bar {
  background-image: linear-gradient(45deg, #99302e 20%, transparent 20%, transparent 50%, #99302e 50%, #99302e 75%, transparent 75%, transparent);
}
</style>

<!-- 3G2,3GP,3GPP,AVI,CAVS,DV,DVR,FLV,M2TS,M4V,MKV,MOD,MOV,MP4,MPEG,MPG,MTS,MXF,OGG,RM,RMVB,SWF,TS,VOB,WEBM,WMV,WTV -->
