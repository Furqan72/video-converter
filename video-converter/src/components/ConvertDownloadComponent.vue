<template>
  <pre v-if="(allowed = true)">
    {{ GlobalData.downloadUrlFromNode }}
    {{ GlobalData.downloadName }}
    {{ GlobalData.deletedFile }}
    <!-- {{ GlobalData.errMessage }} -->
    <!-- {{ GlobalData.progressElement }} -->
  </pre>
  <!-- Convert -->
  <div class="mx-28 flex flex-col items-center justify-center bg-white py-12">
    <p class="my-5 text-center text-xl font-semibold text-red-600" v-if="GlobalData.errMessage">{{ GlobalData.errMessage === ' Conversion failed!!' ? 'Conversion failed!! Try some other editing options or change the video.' : getErrorDescription(GlobalData.errMessage) + ' Conversion failed!!' }}</p>
    <button type="submit" class="flex w-44 items-center justify-center rounded-lg border-0 bg-[#b53836ff] bg-opacity-75 px-8 py-4 text-white outline-none duration-200 hover:bg-opacity-100 hover:shadow-xl focus:outline-none" :disabled="GlobalData.fileSizeExceeded === true || GlobalData.markWrongFormat === true || GlobalData.formatCheck === true || (GlobalData.progressElement !== 0 && GlobalData.progressElement !== 100)">
      <ConvertIcon :class="GlobalData.progressElement !== 0 && GlobalData.progressElement !== 100 ? 'rectangle' : ''" />
      <span>Convert</span>
    </button>

    <!-- loading -->
    <div class="flex w-full flex-col items-center justify-center py-5" v-if="GlobalData.progressElement !== 0">
      <div class="mt-5 flex h-8 w-96 items-center rounded-full bg-gray-200 px-3 shadow-lg">
        <p class="h-4 w-0 rounded-full duration-500" :class="GlobalData.progressElement !== 100 ? 'bg-[#b53836]' : ' bg-green-500'" :style="{ width: GlobalData.progressElement + '%' }"></p>
      </div>

      <div class="mt-2 flex items-center justify-center">
        <span class="mr-2 block font-semibold duration-300" :class="GlobalData.progressElement !== 100 ? 'text-black' : 'text-green-500'">{{ GlobalData.progressElement !== 100 ? 'Converting' : 'Conversion Complete' }} </span>
        <div class="flex justify-center" v-if="GlobalData.progressElement !== 100">
          <div class="pulse-bubble-1 mx-[2px] h-1 w-1 rounded-full bg-black"></div>
          <div class="pulse-bubble-2 mx-[2px] h-1 w-1 rounded-full bg-black"></div>
          <div class="pulse-bubble-3 mx-[2px] h-1 w-1 rounded-full bg-black"></div>
        </div>
      </div>
    </div>
    <!-- Download -->
    <a :href="GlobalData.downloadUrlFromNode" id="downloadBtn" :download="GlobalData.downloadName" class="relative mt-3 flex w-44 rounded-lg border-0 bg-green-500 bg-opacity-75 px-8 py-4 text-white outline-none duration-200 hover:bg-opacity-100 hover:text-white hover:shadow-xl focus:outline-none">
      <DownloadIcon />
      Download</a
    >
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
// import io from 'socket.io-client';
// icons
import DownloadIcon from '../../src/assets/icons/DownloadIcon.vue';
import ConvertIcon from '../../src/assets/icons/ConvertIcon.vue';

import { useGlobalStore } from '../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

const allowed = ref(false);

// // disable button for n-time
// const isDisabledWithTimer = ref(false);
// const countdown = ref(3);
// const downloadDisable = () => {
//   isDisabledWithTimer.value = true;
//   let secondsLeft = countdown.value;
//   const timer = setInterval(() => {
//     secondsLeft--;
//     countdown.value = secondsLeft;
//     if (secondsLeft === 0) {
//       isDisabledWithTimer.value = false;
//       countdown.value = 3;
//       clearInterval(timer);
//     }
//   }, 1000);
// };

// response from the socket.io (provides duration of converting the file, errors and other messages from the server)
// const allErrors = ref('');
// const GlobalData.progressElement = ref(0);
// const socket = io('http://localhost:4000');
// // onMounted(() => {
// socket.on('message', (message) => {
//   GlobalData.errMessage = message;
//   // console.log(GlobalData.errMessage);
// });
// socket.on('errMessage', (errorMessage) => {
//   GlobalData.errMessage = errorMessage;
// });
// socket.on('progress', (progressPercent) => {
//   GlobalData.GlobalData.progressElement = progressPercent;
// });
// });

const errorArr = ref([
  { label: 'Could not find', description: 'Video not convertable with the provided options. Try different settings.' },
  { label: 'Unsupported codec', description: 'Either video or audio codec is not supported. Please try different Codec.' },
  { label: 'codec failed', description: 'Either video or audio codec is not supported. Please try different Codec.' },
  { label: 'Error setting option tune to', description: 'This value of tune is not supported. Please select different value.' },
  { label: 'Possible tunes: psnr ssim grain', description: 'This value of tune is not supported. Please select different value.' },
  { label: 'Unsupported audio codec. Must be one of', description: 'This audio codec is not supported for this video.' },
  { label: 'Error setting option profile', description: 'This profile value is not supported for the uploaded video. Please try different value.' },
  { label: 'Packet is missing PTS', description: 'Video missing metadata.' },
  { label: 'is not available', description: 'Video not convertable with these options. Select different values.' },
  { label: 'does not yet support', description: 'Video not convertable with these options. Select different values.' },
  { label: 'Only VP8 or VP9 or AV1', description: 'This video with these selected options cannot be converted to WEBM format.' },
  { label: 'only supports', description: 'These options are not supported for this video. Try other options.' },
  { label: 'compatible', description: 'This video is not compatible with these options.' },
  { label: 'Cannot open libx265 encoder', description: 'This video codec is not supported for the uploaded video.' },
  { label: 'Streamcopy', description: 'Watermark or subtitles cannot be applied on the video because of copy codec.' },
  { label: 'not create encoder reference', description: 'Complete metadata of the video not found. Try uploading a different video.' },
  { label: 'at most one', description: 'Video not convertable. Try another video.' },
  { label: 'is not supported in', description: 'This video cannot be converted with these options. Try selecting different options for audio and video.' },
  { label: 'width must be', description: 'Video not convertable. Covnersion not possible.' },
  { label: 'width not', description: 'Width of the video contains odd no. of pixels. Cannot be converted using x264 and x265 codecs.' },
  { label: 'only supported in', description: 'The selected options cannot be applied on this video.' },
  { label: 'codec tag found for', description: 'This video is not compatible with these options.' },
  { label: 'can only be written', description: 'This video is not compatible with these options.' },
  { label: 'encoder setup failed', description: 'This video is not compatible with these options.' },
  { label: 'Unable to find', description: 'Video metadata is missing data. Video cannot be converted.' },
  { label: 'does not yet support', description: 'These setting options are not available for this video.' },
  { label: 'unsupported image format', description: 'Input file contains unsupported image format.' },
]);

// displaying customized errors
const errorMessage = ref(null);
const getErrorDescription = (error) => {
  const matchedError = errorArr.value.find((errorObj) => error.includes(errorObj.label));
  console.log(matchedError);
  return matchedError ? matchedError.description : error;
};

watch(
  () => GlobalData.errMessage,
  (newErrMessage) => {
    errorMessage.value = getErrorDescription(newErrMessage);
  }
);
</script>

<style scoped>
.pulse-bubble-1 {
  animation: pulse 0.4s ease 0s infinite alternate;
}
.pulse-bubble-2 {
  animation: pulse 0.4s ease 0.2s infinite alternate;
}
.pulse-bubble-3 {
  animation: pulse 0.4s ease 0.4s infinite alternate;
}

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

.rectangle {
  animation: spin 3s infinite;
  transform-origin: 10px 10px;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
