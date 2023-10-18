<template>
  <main class="bg-[#f9f9f9ff]">
    <div class="fixed bottom-0 right-0 z-50 max-h-[550px] max-w-[550px] overflow-scroll bg-white">
      <button class="m-3 h-9 w-9 rounded-full bg-red-700" @click="show2 = !show2"></button>
      <pre v-if="show2">{{ metaData }}</pre>
    </div>

    <form @submit.prevent="sendFile">
      <!-- Video Conversion -->
      <VideoConverter />

      <!-- Video Conversion -->
      <!-- <ImageConverter /> -->
    </form>
    <!-- Introduction  -->
    <Introduction />
  </main>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';
// components
import VideoConverter from '../../src/components/VideoCovnersionOptions/VideoConverter.vue';
// import ImageConverter from '../../src/components/ImageCovnersionOptions/ImageConverter.vue';
import Introduction from '../components/Introduction.vue';

// global store
import { useGlobalStore } from '../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

const show2 = ref(false);
const metaData = ref();
const formSubmitted = ref(false);
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
        GlobalData.uploadLoading = percentCompleted;
      },
    })
    .then((response) => {
      GlobalData.downloadUrlFromNode = 'http://localhost:4000/' + response.data.downloadUrl;
      GlobalData.downloadName = response.data.fileName;
      GlobalData.errMessage = response.data.message;
      // full metaData
      metaData.value = response.data.fullVideoData;
    })
    .catch((error) => {
      console.error('An error occurred:', error);
    });

  formSubmitted.value = true;
};
</script>
