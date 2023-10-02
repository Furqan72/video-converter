<!-- 3G2,3GP,3GPP,AVI,CAVS,DV,DVR,FLV,M2TS,M4V,MKV,MOD,MOV,MP4,MPEG,MPG,MTS,MXF,OGG,RM,RMVB,SWF,TS,VOB,WEBM,WMV,WTV -->

<template>
  <div class="flex flex-col items-center justify-center gap-y-5 px-28 py-14">
    <!-- Upload -->
    <p v-if="GlobalData.fileSizeExceeded || GlobalData.formatCheck" class="text-center text-red-600">{{ GlobalData.fileSizeExceeded === true ? 'File size exceeded the limit of 25 MB' : '' || GlobalData.formatCheck === true ? 'Wrong format file. Please upload only mp4 files.' : '' }}</p>
    <div class="relative mx-auto flex w-48 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#b53836ff] py-4 text-xl text-white duration-300 hover:font-semibold hover:shadow-2xl">
      <input type="file" name="videoFile" class="absolute bottom-0 left-0 right-0 top-0 m-0 cursor-pointer p-0 opacity-0 filter-none" @change="checkFileSize" required />
      <svg :class="GlobalData.fileSize === null ? 'hidden' : 'block'" xmlns="http://www.w3.org/2000/svg" class="mr-2 h-7 w-7" fill="currentColor" viewBox="0 0 104.69 122.88" style="enable-background: new 0 0 104.69 122.88" xml:space="preserve">
        <g><path d="M31.54,86.95c-1.74,0-3.16-1.43-3.16-3.19c0-1.76,1.41-3.19,3.16-3.19h20.5c1.74,0,3.16,1.43,3.16,3.19 c0,1.76-1.41,3.19-3.16,3.19H31.54L31.54,86.95z M31.54,42.27c-1.74,0-3.15-1.41-3.15-3.15c0-1.74,1.41-3.15,3.15-3.15h41.61 c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54L31.54,42.27z M66.57,108.66c-1.36-1.08-1.59-3.06-0.5-4.42 c1.08-1.36,3.06-1.59,4.42-0.5l9.57,7.59l18.21-22.27c1.1-1.35,3.09-1.54,4.43-0.44c1.35,1.1,1.54,3.09,0.44,4.43l-20.17,24.67l0,0 c-1.09,1.33-3.04,1.54-4.39,0.47L66.57,108.66L66.57,108.66z M56.85,116.58c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15 H7.33c-2.02,0-3.85-0.82-5.18-2.15C0.82,119.4,0,117.57,0,115.55V7.33c0-2.02,0.82-3.85,2.15-5.18C3.48,0.82,5.31,0,7.33,0h90.02 c2.02,0,3.85,0.82,5.18,2.15c1.33,1.33,2.15,3.16,2.15,5.18V72.6c0,1.74-1.41,3.15-3.15,3.15c-1.74,0-3.15-1.41-3.15-3.15V7.33 c0-0.28-0.12-0.54-0.3-0.73c-0.19-0.19-0.45-0.3-0.73-0.3H7.33c-0.28,0-0.54,0.12-0.73,0.3C6.42,6.8,6.3,7.05,6.3,7.33v108.21 c0,0.28,0.12,0.54,0.3,0.73c0.19,0.19,0.45,0.3,0.73,0.3H56.85L56.85,116.58z M31.54,64.59c-1.74,0-3.15-1.41-3.15-3.15 c0-1.74,1.41-3.15,3.15-3.15h41.61c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54L31.54,64.59z" /></g>
      </svg>
      <svg :class="GlobalData.fileSize === null ? 'block' : 'hidden'" xmlns="http://www.w3.org/2000/svg" class="mr-2 h-7 w-7" fill="currentColor" viewBox="0 0 107.07 122.88" style="enable-background: new 0 0 107.07 122.88" xml:space="preserve">
        <g>
          <path d="M31.54,86.95c-1.74,0-3.16-1.43-3.16-3.19c0-1.76,1.41-3.19,3.16-3.19h20.5c1.74,0,3.16,1.43,3.16,3.19 c0,1.76-1.41,3.19-3.16,3.19H31.54L31.54,86.95z M31.54,42.27c-1.74,0-3.15-1.41-3.15-3.15c0-1.74,1.41-3.15,3.15-3.15h41.61 c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54L31.54,42.27z M56.85,116.58c1.74,0,3.15,1.41,3.15,3.15 c0,1.74-1.41,3.15-3.15,3.15H7.33c-2.02,0-3.85-0.82-5.18-2.15C0.82,119.4,0,117.57,0,115.55V7.33c0-2.02,0.82-3.85,2.15-5.18 C3.48,0.82,5.31,0,7.33,0h90.02c2.02,0,3.85,0.82,5.18,2.15c1.33,1.33,2.15,3.16,2.15,5.18V72.6c0,1.74-1.41,3.15-3.15,3.15 s-3.15-1.41-3.15-3.15V7.33c0-0.28-0.12-0.54-0.3-0.73c-0.19-0.19-0.45-0.3-0.73-0.3H7.33c-0.28,0-0.54,0.12-0.73,0.3 C6.42,6.8,6.3,7.05,6.3,7.33v108.21c0,0.28,0.12,0.54,0.3,0.73c0.19,0.19,0.45,0.3,0.73,0.3H56.85L56.85,116.58z M83.35,83.7 c0-1.73,1.41-3.14,3.14-3.14c1.73,0,3.14,1.41,3.14,3.14l-0.04,14.36l14.34,0.04c1.73,0,3.14,1.41,3.14,3.14s-1.41,3.14-3.14,3.14 l-14.35-0.04l-0.04,14.34c0,1.73-1.41,3.14-3.14,3.14c-1.73,0-3.14-1.41-3.14-3.14l0.04-14.35l-14.34-0.04 c-1.73,0-3.14-1.41-3.14-3.14c0-1.73,1.41-3.14,3.14-3.14l14.36,0.04L83.35,83.7L83.35,83.7z M31.54,64.59 c-1.74,0-3.15-1.41-3.15-3.15c0-1.74,1.41-3.15,3.15-3.15h41.61c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54 L31.54,64.59z" />
        </g>
      </svg>
      <span>Upload</span>
    </div>
    <div v-if="GlobalData.fileSize !== null" class="shadow-lg">
      <video v-if="previewUrl" width="350" height="200" class="mt-5 rounded-md">
        <source :src="previewUrl" type="video/mp4" />
      </video>
    </div>
    <!-- loading -->
    <div class="mt-1 text-center" :class="GlobalData.uploadLoading === '' ? 'hidden' : 'block'">
      <div class="flex h-7 w-80 items-center rounded-full border bg-gray-200 px-3 shadow-lg duration-300">
        <p class="h-[14px] w-0 rounded-full text-center duration-500" :class="GlobalData.uploadLoading !== 100 ? 'bg-[#b53836ff]' : 'bg-green-500'" :style="{ width: GlobalData.uploadLoading + '%' }"></p>
      </div>
      <span class="mt-3 block font-semibold duration-300" :class="GlobalData.uploadLoading !== 100 ? 'text-black' : 'text-green-500'">{{ GlobalData.uploadLoading !== 100 ? 'Uploading' : 'Uploading Complete' }} </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// global store
import { useGlobalStore } from '../../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

// file size & type check
const previewUrl = ref(null);
const checkFileSize = (event) => {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    // const validExtensions = '.mp4';
    // const fileExtension = file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2);

    // extension
    GlobalData.selectedFileFormat = file.name.slice(file.name.lastIndexOf('.'));
    console.log(GlobalData.selectedFileFormat);

    if (file.size > 50000000) {
      GlobalData.fileSizeExceeded = true;
      GlobalData.fileSize = null;
      // } else if (!validExtensions.includes('.' + fileExtension)) {
      //   GlobalData.formatCheck = true;
    } else {
      GlobalData.formatCheck = false;
      GlobalData.fileSizeExceeded = false;
      GlobalData.fileSize = file.size;

      const objectURL = URL.createObjectURL(file);
      previewUrl.value = objectURL;
    }
  } else {
    GlobalData.fileSize = null;
  }
};
</script>
