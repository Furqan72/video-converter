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
          <ConvertDownloadComponent />
        </div>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
// components
import Header from '../../src/components/Header.vue';
import FileUploadCOmponent from '../../src/components/FileUploadCOmponent.vue';
import VideoOptionComponent from '../../src/components/VideoOptionComponent.vue';
import AudioOptionComponent from '../../src/components/AudioOptionComponent.vue';
import SubtitlesComponent from '../../src/components/SubtitlesComponent.vue';
import TrimmingComponent from '../../src/components/TrimmingComponent.vue';
import WaterMarkComponent from '../../src/components/WaterMarkComponent.vue';
import OthersComponent from '../../src/components/OthersComponent.vue';
import ConvertDownloadComponent from '../../src/components/ConvertDownloadComponent.vue';
// global store
import { useGlobalStore } from '../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

// const moduleUrl = import.meta.env.VITE_ROOT_URL;

const formSubmitted = ref(false);
const uploadLoading = ref('');
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
      },
    })
    .then((response) => {
      GlobalData.downloadUrlFromNode = 'http://localhost:4000/' + response.data.downloadUrl;
      GlobalData.downloadName = response.data.fileName;
      GlobalData.errMessage = response.data.message;
    })
    .catch((error) => {
      console.error('An error occurred:', error);
    });

  // socket.emit('message', 'File Upload Started');
  formSubmitted.value = true;
};
</script>
