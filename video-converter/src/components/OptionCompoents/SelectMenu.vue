<template>
  <div class="grid h-[350px] bg-[#363636ff] px-28 pt-20 text-white lg:grid-cols-2">
    <div class="maxlg:text-center">
      <h1 class="text-3xl font-bold leading-relaxed">
        Transform <span>{{ convertingName === '' ? 'your video files' : convertingName.label }}</span> Files into <span :class="GlobalData.selectedFormat !== '...' ? 'uppercase' : ''">{{ GlobalData.selectedFormat === '...' ? 'a Variety of Formats' : GlobalData.selectedFormat.substring(1) }}</span
        >.
      </h1>
      <p class="py-2">Unleash Your Media Potential with Our Comprehensive Video Conversion Services</p>
    </div>
    <div class="flex justify-center text-center maxlg:pb-12">
      <div class="mt-10 font-semibold">
        <span class="mr-3">Convert</span>
        <select v-model="GlobalData.selectedFileFormat" name="ConvertFromSelect" class="w-36 rounded-lg border bg-[#363636ff] px-4 py-3 text-lg outline-none">
          <option v-for="(option, index) in videoFormats" :key="index" :value="option.value">{{ option.label }}</option>
        </select>
        <span class="mx-3">to</span>
        <select @change="updateSelectedFormat" name="selectMenu" class="w-36 rounded-lg border bg-[#363636ff] px-4 py-3 text-lg outline-none">
          <option v-for="(option, index) in computedconvertTo" :key="index" :value="option.value">{{ option.label }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useGlobalStore } from '../../../src/Store/GlobalStore.js';

const GlobalData = useGlobalStore();

// formats to convert from
const videoFormats = ref([
  { label: '3G2', value: '.3g2' },
  { label: '3GP', value: '.3gp' },
  { label: '3GPP', value: '.3gpp' },
  { label: 'AVI', value: '.avi' },
  { label: 'CAVS', value: '.cavs' },
  { label: 'DV', value: '.dv' },
  { label: 'DVR', value: '.dvr' },
  { label: 'FLV', value: '.flv' },
  { label: 'M2TS', value: '.m2ts' },
  { label: 'M4V', value: '.m4v' },
  { label: 'MKV', value: '.mkv' },
  { label: 'MOD', value: '.mod' },
  { label: 'MOV', value: '.mov' },
  { label: 'MP4', value: '.mp4' },
  { label: 'MPEG', value: '.mpeg' },
  { label: 'MPG', value: '.mpg' },
  { label: 'MTS', value: '.mts' },
  { label: 'MXF', value: '.mxf' },
  { label: 'OGG', value: '.ogg' },
  { label: 'RM', value: '.rm' },
  { label: 'RMVB', value: '.rmvb' },
  { label: 'SWF', value: '.swf' },
  { label: 'TS', value: '.ts' },
  { label: 'VOB', value: '.vob' },
  { label: 'WEBM', value: '.webm' },
  { label: 'WMV', value: '.wmv' },
  { label: 'WTV', value: '.wtv' },
]);

// formats to convert to
const covnertTo = ref([
  { label: '...', value: '...' },
  { label: 'AVI', value: '.avi' },
  { label: 'FLV', value: '.flv' },
  { label: 'MKV', value: '.mkv' },
  { label: 'MOV', value: '.mov' },
  { label: 'MP4', value: '.mp4' },
  { label: 'WEBM', value: '.webm' },
  { label: 'WMV', value: '.wmv' },
]);

// adding options to second arrays
const computedconvertTo = computed(() => {
  const selectedValue = GlobalData.selectedFileFormat;
  const existingOption = covnertTo.value.find((option) => option.value === selectedValue);

  return existingOption ? covnertTo.value : [...covnertTo.value, videoFormats.value.find((option) => option.value === selectedValue)];
});

// checking the update value of second array
const updateSelectedFormat = (event) => {
  GlobalData.selectedFormat = event.target.value;
};

// checking the update value of first array
const convertingName = ref({ label: '', value: '' });
watch(
  () => GlobalData.selectedFileFormat,
  (newSelectedFormat) => {
    const matchingFormat = videoFormats.value.find((format) => format.value === newSelectedFormat);
    if (matchingFormat) {
      convertingName.value = matchingFormat;
    }
  }
);
</script>
