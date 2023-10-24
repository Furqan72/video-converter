<template>
  <main class="bg-[#f9f9f9ff]">
    <div class="fixed bottom-0 right-0 z-50 max-h-[550px] max-w-[550px] overflow-scroll bg-white">
      <button class="m-3 h-9 w-9 rounded-full bg-red-700" @click="show2 = !show2"></button>
      <pre v-if="show2">{{ meta }}</pre>
      <pre v-if="show2">{{ GlobalData.metaData }}</pre>
    </div>
    <form @submit.prevent="sendImageFile">
      <!-- select format -->
      <SelectImageFormat />

      <!-- Upload -->
      <FileUploadComponent />

      <!-- Options -->
      <div class="mx-auto h-full bg-[#f9f9f9ff] px-28">
        <div class="bg-white pb-14">
          <!-- Video options -->
          <EditingOptions />
        </div>
      </div>
      <ConvertDownloadComponent />
    </form>
  </main>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
// components
import FileUploadComponent from '../../components/FileUploadComponent.vue';
import SelectImageFormat from '../../../src/components/ImageCovnersionOptions/SelectImageFormat.vue';
import EditingOptions from '../../../src/components/ImageCovnersionOptions/EditingOptions.vue';
import ConvertDownloadComponent from '../ConvertDownloadComponent.vue';

// global store
import { useGlobalStore } from '../../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

const meta = ref();
const show2 = ref(false);

const sendImageFile = async () => {
  const form = document.querySelector('form');
  const formData = new FormData(form);

  await GlobalData.sendVideoFile(formData, 'image-convert');
  console.log('newData: ', GlobalData.metaData);
  meta.value = GlobalData.metaData;
};
</script>
