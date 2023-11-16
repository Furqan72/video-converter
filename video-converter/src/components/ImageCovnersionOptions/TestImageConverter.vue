<template>
  <main class="bg-[#f9f9f9ff] pb-16">
    <div class="fixed bottom-0 right-0 z-50 max-h-[550px] max-w-[550px] overflow-scroll bg-white">
      <button class="m-3 h-9 w-9 rounded-full bg-red-700" @click="show2 = !show2"></button>
      <pre v-if="show2">{{ GlobalData.metaData }}</pre>
    </div>
    <form @submit.prevent="sendImageFile">
      <!-- select format -->
      <SelectImageFormat />

      <!-- Upload -->
      <ReuseableFileUpload :loading-bar="GlobalData.uploadLoading" :file-size="GlobalData.fileSize" :selected-format="GlobalData.selectedImageFileFormat" :size-limit="GlobalData.fileSizeExceeded" :check-format="GlobalData.formatCheck" />

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
import { ref, onMounted } from 'vue';
// import EventSource from 'eventsource';
// import io from 'socket.io-client';

// components
import ReuseableFileUpload from '../../components/reuseableComponents/ReuseableFileUpload.vue';
import SelectImageFormat from '../../../src/components/ImageCovnersionOptions/SelectImageFormat.vue';
import EditingOptions from '../../../src/components/ImageCovnersionOptions/EditingOptions.vue';
import ConvertDownloadComponent from '../ConvertDownloadComponent.vue';

// global store
import { useGlobalStore } from '../../../src/Store/GlobalStore.js';

const GlobalData = useGlobalStore();
const show2 = ref(false);
let eventSource;

const setupSSE = () => {
  console.log(1);
  eventSource = new EventSource('http://localhost:8080/sse');

  eventSource.addEventListener('progress', (event) => {
    const data = JSON.parse(event.data);
    GlobalData.progressElement = data.percentage;
    console.log(data.percentage);
  });

  eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
    eventSource.close();
  };
};

const sendImageFile = async () => {
  const form = document.querySelector('form');
  const formData = new FormData(form);

  setupSSE();

  try {
    await GlobalData.sendVideoFile(formData, 'image-convert');
    console.log('newData: ', GlobalData.metaData);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    if (eventSource) {
      eventSource.close();
    }
  }
};
</script>
