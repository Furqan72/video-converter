<!-- ,,,,,,DVR,,,,,MOD,,,MPEG,,,,,RM,RMVB,SWF,TS,VOB,WEBM,WMV,WTV -->

<template>
  <main class="bg-[#f9f9f9ff]">
    <div class="fixed bottom-0 right-0 z-50 max-h-[550px] max-w-[550px] overflow-scroll bg-white">
      <button class="m-3 h-9 w-9 rounded-full bg-red-700" @click="show2 = !show2"></button>
      <pre v-if="show2">{{ metaData }}</pre>
    </div>

    <form @submit.prevent="sendFile">
      <!-- select format -->
      <SelectMenu />

      <!-- Upload -->
      <FileUploadCOmponent />

      <!-- Options -->
      <div class="h-full bg-[#f9f9f9ff] px-28">
        <div class="bg-white pb-14">
          <!-- Video options -->
          <VideoOptionComponent />

          <!-- Audio options -->
          <AudioOptionComponent />

          <!-- Subtitles options -->
          <SubtitlesComponent v-show="!showSubtitlesComponent" />

          <!-- Trim -->
          <TrimmingComponent />

          <!-- Watermark -->
          <WaterMarkComponent v-if="GlobalData.selectedFormat !== '.cavs' && GlobalData.selectedFormat !== '.dv' && GlobalData.selectedFormat !== '.m2ts'" />

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
import { ref, watch, computed } from 'vue';
import axios from 'axios';
// components
import SelectMenu from '../../src/components/OptionCompoents/SelectMenu.vue';
import FileUploadCOmponent from '../../src/components/OptionCompoents/FileUploadCOmponent.vue';
import VideoOptionComponent from '../../src/components/OptionCompoents/VideoOptionComponent.vue';
import AudioOptionComponent from '../../src/components/OptionCompoents/AudioOptionComponent.vue';
import SubtitlesComponent from '../../src/components/OptionCompoents/SubtitlesComponent.vue';
import TrimmingComponent from '../../src/components/OptionCompoents/TrimmingComponent.vue';
import WaterMarkComponent from '../../src/components/OptionCompoents/WaterMarkComponent.vue';
import OthersComponent from '../../src/components/OptionCompoents/OthersComponent.vue';
import ConvertDownloadComponent from '../../src/components/OptionCompoents/ConvertDownloadComponent.vue';
// global store
import { useGlobalStore } from '../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

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

const subtitlesNotIncluded = ['.avi', '.flv', '.wmv', '.webm', '.3g2', '.3gp', '.cavs', '.dv', '.m2ts', '.mpg', '.mpeg', '.mts', '.mxf', '.ogg', '.rm', '.rmvb'];
const showSubtitlesComponent = computed(() => {
  const selectedFormat = GlobalData.selectedFormat;
  return subtitlesNotIncluded.some((format) => selectedFormat.includes(format));
});

watch(
  () => GlobalData.selectedFormat,
  () => {
    showSubtitlesComponent.value;
  }
);

const show2 = ref(false);
</script>
