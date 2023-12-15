<template>
  <div class="bg-[#f9f9f9ff] pb-16">
    <!-- <div class="fixed bottom-0 right-0 z-50 max-h-[550px] max-w-[550px] overflow-scroll bg-white">
      <button class="m-3 h-9 w-9 rounded-full bg-red-700" @click="show2 = !show2"></button>
      <pre v-if="show2">{{ meta }}</pre>
      <pre v-if="show2">{{ GlobalData.metaData }}</pre>
    </div> -->

    <form @submit.prevent="sendVideoFile">
      <!-- select format -->
      <SelectMenu />

      <!-- Upload -->
      <ReuseableFileUpload :loading-bar="GlobalData.uploadLoading" :file-size="GlobalData.fileSize" :selected-format="GlobalData.selectedFileFormat" :size-limit="GlobalData.fileSizeExceeded" :check-format="GlobalData.formatCheck" />

      <!-- Options -->
      <div class="mx-auto h-full bg-[#f9f9f9ff] px-28">
        <div class="bg-white">
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

          <!-- covnert  -->
          <ConvertDownloadComponent />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

// components
import SelectMenu from '../../../src/components/VideoCovnersionOptions/SelectMenu.vue';
import ReuseableFileUpload from '../../components/reuseableComponents/ReuseableFileUpload.vue';
import VideoOptionComponent from '../../../src/components/VideoCovnersionOptions/VideoOptionComponent.vue';
import AudioOptionComponent from '../../../src/components/VideoCovnersionOptions/AudioOptionComponent.vue';
import SubtitlesComponent from '../../../src/components/VideoCovnersionOptions/SubtitlesComponent.vue';
import TrimmingComponent from '../../../src/components/VideoCovnersionOptions/TrimmingComponent.vue';
import WaterMarkComponent from '../../../src/components/VideoCovnersionOptions/WaterMarkComponent.vue';
import OthersComponent from '../../../src/components/VideoCovnersionOptions/OthersComponent.vue';
import ConvertDownloadComponent from '../../components/ConvertDownloadComponent.vue';

// global store
import { useGlobalStore } from '../../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

const meta = ref();
const show2 = ref(false);

const sendVideoFile = async () => {
  // Prepare and send the form data via Axios
  const form = document.querySelector('form');
  const formData = new FormData(form);

  GlobalData.sendVideoFile(formData, 'video-conversion');
  // .then(() => {
  //   console.log('newData: ', GlobalData.metaData);
  // });
};

const subtitlesNotIncluded = ['.avi', '.flv', '.wmv', '.webm', '.3g2', '.3gp', '.cavs', '.dv', '.m2ts', '.mpg', '.mpeg', '.mts', '.mxf', '.ogg', '.rm', '.rmvb', '.swf', '.MOD', '.ts', '.wtv'];
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
</script>
