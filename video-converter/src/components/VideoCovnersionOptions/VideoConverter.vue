<template>
  <div>
    <!-- select format -->
    <SelectMenu />

    <!-- Upload -->
    <FileUploadCOmponent />

    <!-- Options -->
    <div class="mx-auto h-full bg-[#f9f9f9ff] px-28">
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

        <!-- covnert  -->
        <ConvertDownloadComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
// components
import SelectMenu from '../../../src/components/OptionCompoents/SelectMenu.vue';
import FileUploadCOmponent from '../../../src/components/OptionCompoents/FileUploadCOmponent.vue';
import VideoOptionComponent from '../../../src/components/OptionCompoents/VideoOptionComponent.vue';
import AudioOptionComponent from '../../../src/components/OptionCompoents/AudioOptionComponent.vue';
import SubtitlesComponent from '../../../src/components/OptionCompoents/SubtitlesComponent.vue';
import TrimmingComponent from '../../../src/components/OptionCompoents/TrimmingComponent.vue';
import WaterMarkComponent from '../../../src/components/OptionCompoents/WaterMarkComponent.vue';
import OthersComponent from '../../../src/components/OptionCompoents/OthersComponent.vue';
import ConvertDownloadComponent from '../../../src/components/OptionCompoents/ConvertDownloadComponent.vue';

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
