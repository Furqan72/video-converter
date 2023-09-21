<template>
  <main>
    <form @submit.prevent="sendFile">
      <!-- Header -->
      <Header />

      <!-- Upload -->
      <FileUploadCOmponent />

      <!-- Options -->
      <div class="flex w-full flex-col items-center justify-center bg-[#f9f9f9] py-5" :class="uploadLoading === '' ? 'hidden' : 'block'">
        <div class="flex h-7 w-80 items-center rounded-full border bg-gray-200 px-3 shadow-lg duration-300">
          <p class="h-[14px] w-0 rounded-full text-center duration-500" :class="uploadLoading !== 100 ? 'bg-[#b53836ff]' : 'bg-green-500'" :style="{ width: uploadLoading + '%' }"></p>
        </div>
        <span class="mt-2 font-semibold duration-300" :class="uploadLoading !== 100 ? 'text-black' : 'text-green-500'">{{ uploadLoading !== 100 ? 'Uploading' : 'Uploading Complete' }} </span>
      </div>
      <div class="h-full bg-[#f9f9f9ff] px-20">
        <div class="mb-20 bg-white">
          <h3 class="flex items-center justify-start px-10 py-5 text-lg font-semibold text-gray-color">
            <img src="../assets/images/wrench.png" alt="" class="mr-5 h-5 w-5" />
            <span>OPTIONS</span>
          </h3>

          <!-- Video options -->
          <VideoOptionComponent />

          <!-- Audio options -->
          <AudioOptionComponent />

          <!-- Subtitles options -->
          <SubtitlesComponent :class="GlobalData.selectedFormat === '.webm' || GlobalData.selectedFormat === '.wmv' || GlobalData.selectedFormat === '.avi' || GlobalData.selectedFormat === '.flv' ? 'hidden' : 'block'" />

          <!-- Trim -->
          <TrimmingComponent />

          <!-- Watermark -->
          <WaterMarkComponent />

          <!-- Other -->
          <OthersComponent />

          <!-- Convert -->
          <div class="mt-14 flex flex-col items-center justify-center">
            <p class="mb-10 mt-5 text-center text-red-600" :class="errMessage === '' ? 'hidden' : 'block'">{{ errMessage }}</p>
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
            <a @click="downloadClick()" :target="GlobalData.selectedFormat === '.webm' ? '_blank' : ''" :href="downloadUrlNode" id="downloadBtn" :download="downloadName" class="mt-3 flex w-44 rounded-lg border-0 bg-green-500 bg-opacity-75 px-8 py-4 text-white outline-none duration-200 hover:bg-opacity-100 hover:text-white hover:shadow-xl focus:outline-none" :class="[progressElement === 100 ? 'flex' : 'hidden', progressElement !== 100 ? 'pointer-events-none' : 'cursor-pointer']">
              <DownloadIcon />
              Download</a
            >
          </div>
        </div>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import io from 'socket.io-client';
// components
import VideoOptionComponent from '../../src/components/VideoOptionComponent.vue';
import AudioOptionComponent from '../../src/components/AudioOptionComponent.vue';
import OthersComponent from '../../src/components/OthersComponent.vue';
import SubtitlesComponent from '../../src/components/SubtitlesComponent.vue';
import TrimmingComponent from '../../src/components/TrimmingComponent.vue';
import WaterMarkComponent from '../../src/components/WaterMarkComponent.vue';
import FileUploadCOmponent from '../../src/components/FileUploadCOmponent.vue';
import Header from '../../src/components/Header.vue';
// icons
import DownloadIcon from '../../src/assets/icons/DownloadIcon.vue';
import ConvertIcon from '../../src/assets/icons/ConvertIcon.vue';
// global store
import { useGlobalStore } from '../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

// const moduleUrl = import.meta.env.VITE_ROOT_URL;

// const fileInputRef = ref(null);
const showConvertButton = ref(true);
const downloadClick = () => {
  if (showConvertButton === true) {
    showConvertButton.value = !showConvertButton.value;
  }
};

// getting response from the socket.io
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

const formSubmitted = ref(false);
const downloadUrlNode = ref('');
const downloadName = ref('');
const uploadLoading = ref('');
const errMessage = ref('');
const sendFile = async () => {
  const form = document.querySelector('form');
  const formData = new FormData(form);

  axios
    .post('http://localhost:4000/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        uploadLoading.value = percentCompleted;
        console.log(uploadLoading.value);
      },
    })
    .then((response) => {
      downloadUrlNode.value = 'http://localhost:4000/' + response.data.downloadUrl;
      downloadName.value = response.data.fileName;
      errMessage.value = response.data.message;
    })
    .catch((error) => {
      console.error('An error occurred:', error);
    });

  // socket.emit('message', 'File Upload Started');
  formSubmitted.value = true;
};

// // refresh window notify
// onMounted(() => {
//   window.addEventListener('beforeunload', function (e) {
//     fetch('/refresh-detected', {
//       method: 'POST',
//     });
//   });
// });
</script>
