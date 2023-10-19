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
        <select v-model="GlobalData.selectedFileFormat" name="ConvertFromSelect" selected=".mp4" class="w-36 rounded-lg border bg-[#363636ff] px-4 py-3 text-lg outline-none">
          <option v-for="(option, index) in videoFormats" :key="index" :value="option.value">{{ option.label }}</option>
        </select>
        <span class="mx-3">to</span>
        <select v-model="GlobalData.selectedFormat" name="selectMenu" selected=".mp4" class="w-36 rounded-lg border bg-[#363636ff] px-4 py-3 text-lg outline-none">
          <option v-for="(option, index) in covnertTo" :key="index" :value="option.value">{{ option.label }}</option>
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
  { label: '3FR', value: '.3fr' },
  { label: 'ARW', value: '.arw' },
  { label: 'AVIF', value: '.avif' },
  { label: 'BMP', value: '.bmp' },
  { label: 'CR2', value: '.cr2' },
  { label: 'CR3', value: '.cr3' },
  { label: 'CRW', value: '.crw' },
  { label: 'DCR', value: '.dcr' },
  { label: 'DNG', value: '.dng' },
  { label: 'EPS', value: '.eps' },
  { label: 'ERF', value: '.erf' },
  { label: 'GIF', value: '.gif' },
  { label: 'HEIC', value: '.heic' },
  { label: 'HEIF', value: '.heif' },
  { label: 'ICNS', value: '.icns' },
  { label: 'ICO', value: '.ico' },
  { label: 'JFIF', value: '.jfif' },
  { label: 'JPEG', value: '.jpeg' },
  { label: 'JPG', value: '.jpg' },
  { label: 'MOS', value: '.mos' },
  { label: 'MRW', value: '.mrw' },
  { label: 'NEF', value: '.nef' },
  { label: 'ODD', value: '.odd' },
  { label: 'ODG', value: '.odg' },
  { label: 'ORF', value: '.orf' },
  { label: 'PEF', value: '.pef' },
  { label: 'PNG', value: '.png', selected: 'png' },
  { label: 'PPM', value: '.ppm' },
  { label: 'PS', value: '.ps' },
  { label: 'PSD', value: '.psd' },
  { label: 'RAF', value: '.raf' },
  { label: 'RAW', value: '.raw' },
  { label: 'RW2', value: '.rw2' },
  { label: 'TIF', value: '.tif' },
  { label: 'TIFF', value: '.tiff' },
  { label: 'WEBP', value: '.webp' },
  { label: 'X3F', value: '.x3f' },
  { label: 'XCF', value: '.xcf' },
  { label: 'XPS', value: '.xps' },
]);

// formats to convert to
const covnertTo = ref([
  { label: '...', value: '...', selected: '...' },
  { label: 'BMP', value: '.bmp' },
  { label: 'EPS', value: '.eps' },
  { label: 'GIF', value: '.gif' },
  { label: 'ICO', value: '.ico' },
  { label: 'JPG', value: '.jpg' },
  { label: 'ODD', value: '.oddm' },
  { label: 'PNG', value: '.png' },
  { label: 'PS', value: '.ps' },
  { label: 'PSD', value: '.psd' },
  { label: 'TIFF', value: '.tiff' },
  { label: 'WEBP', value: '.webp' },
]);

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
