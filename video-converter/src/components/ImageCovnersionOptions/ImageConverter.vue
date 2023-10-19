<template>
  <div class="bg-[#f9f9f9ff]">
    <!-- select format -->
    <SelectImageFormat />

    <!-- Upload -->
    <FileUploadComponent />

    <!-- Options -->
    <div class="mx-auto h-full bg-[#f9f9f9ff] px-28">
      <div class="bg-white pb-14">
        <!-- Video options -->
        <EditingOptions />

        <!-- covnert  -->
        <ConvertDownloadComponent />
      </div>
    </div>
  </div>
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
</script>
