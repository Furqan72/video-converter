<template>
  <div>
    <!-- select format -->
    <SelectMenu />

    <!-- Upload -->
    <FileUploadComponent />

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
        <!-- <ConvertDownloadComponent /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
// components
import SelectMenu from '../../../src/components/VideoCovnersionOptions/SelectMenu.vue';
import FileUploadComponent from '../../components/FileUploadComponent.vue';
import VideoOptionComponent from '../../../src/components/VideoCovnersionOptions/VideoOptionComponent.vue';
import AudioOptionComponent from '../../../src/components/VideoCovnersionOptions/AudioOptionComponent.vue';
import SubtitlesComponent from '../../../src/components/VideoCovnersionOptions/SubtitlesComponent.vue';
import TrimmingComponent from '../../../src/components/VideoCovnersionOptions/TrimmingComponent.vue';
import WaterMarkComponent from '../../../src/components/VideoCovnersionOptions/WaterMarkComponent.vue';
import OthersComponent from '../../../src/components/VideoCovnersionOptions/OthersComponent.vue';
// import ConvertDownloadComponent from '../../components/ConvertDownloadComponent.vue';

// global store
import { useGlobalStore } from '../../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

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
