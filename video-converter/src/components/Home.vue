<template>
  <div>
    <form @submit.prevent="sendFile">
      <div class="grid h-[350px] bg-[#363636ff] px-20 pt-20 text-white lg:grid-cols-2">
        <div class="maxlg:text-center">
          <h1 class="text-3xl font-bold">Transform MP4 Files into a Variety of Formats.</h1>
          <p class="py-2">Unleash Your Media Potential with Our Comprehensive Video Conversion Services</p>
        </div>
        <div class="flex justify-center text-center maxlg:pb-12">
          <div class="mt-10 font-semibold">
            <span class="mr-3">Convert</span>
            <select name="" id="" class="w-40 rounded-lg border bg-[#363636ff] px-4 py-3 text-lg outline-none">
              <option value="mp4">MP4</option>
            </select>
            <span class="mx-3">to</span>
            <select @change="GlobalData.updateSelectedFormat" name="selectMenu" id="" class="w-40 rounded-lg border bg-[#363636ff] px-4 py-3 text-lg outline-none">
              <option value=".avi" selected>AVI</option>
              <option value=".flv">FLV</option>
              <option value=".mkv">MKV</option>
              <option value=".mov">MOV</option>
              <option value=".mp4">MP4</option>
              <option value=".webm">WEBM</option>
              <option value=".wmv">WMV</option>
            </select>
          </div>
        </div>
      </div>
      <!-- Upload -->
      <p v-if="fileSizeExceeded" class="mt-5 text-center text-red-600">File size exceeded the limit of 25 MB</p>
      <div class="flex justify-center bg-[#f9f9f9ff] px-20 py-5">
        <div class="relative flex w-48 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#b53836ff] py-4 text-xl text-white duration-300 hover:font-semibold hover:shadow-2xl">
          <input type="file" name="videoFile" accept="video/*" class="absolute bottom-0 left-0 right-0 top-0 m-0 cursor-pointer p-0 opacity-0 filter-none" @change="checkFileSize" required />
          <svg :class="fileSize === null ? 'hidden' : 'block'" xmlns="http://www.w3.org/2000/svg" class="mr-2 h-7 w-7" fill="currentColor" viewBox="0 0 104.69 122.88" style="enable-background: new 0 0 104.69 122.88" xml:space="preserve">
            <g><path d="M31.54,86.95c-1.74,0-3.16-1.43-3.16-3.19c0-1.76,1.41-3.19,3.16-3.19h20.5c1.74,0,3.16,1.43,3.16,3.19 c0,1.76-1.41,3.19-3.16,3.19H31.54L31.54,86.95z M31.54,42.27c-1.74,0-3.15-1.41-3.15-3.15c0-1.74,1.41-3.15,3.15-3.15h41.61 c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54L31.54,42.27z M66.57,108.66c-1.36-1.08-1.59-3.06-0.5-4.42 c1.08-1.36,3.06-1.59,4.42-0.5l9.57,7.59l18.21-22.27c1.1-1.35,3.09-1.54,4.43-0.44c1.35,1.1,1.54,3.09,0.44,4.43l-20.17,24.67l0,0 c-1.09,1.33-3.04,1.54-4.39,0.47L66.57,108.66L66.57,108.66z M56.85,116.58c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15 H7.33c-2.02,0-3.85-0.82-5.18-2.15C0.82,119.4,0,117.57,0,115.55V7.33c0-2.02,0.82-3.85,2.15-5.18C3.48,0.82,5.31,0,7.33,0h90.02 c2.02,0,3.85,0.82,5.18,2.15c1.33,1.33,2.15,3.16,2.15,5.18V72.6c0,1.74-1.41,3.15-3.15,3.15c-1.74,0-3.15-1.41-3.15-3.15V7.33 c0-0.28-0.12-0.54-0.3-0.73c-0.19-0.19-0.45-0.3-0.73-0.3H7.33c-0.28,0-0.54,0.12-0.73,0.3C6.42,6.8,6.3,7.05,6.3,7.33v108.21 c0,0.28,0.12,0.54,0.3,0.73c0.19,0.19,0.45,0.3,0.73,0.3H56.85L56.85,116.58z M31.54,64.59c-1.74,0-3.15-1.41-3.15-3.15 c0-1.74,1.41-3.15,3.15-3.15h41.61c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54L31.54,64.59z" /></g>
          </svg>
          <svg :class="fileSize === null ? 'block' : 'hidden'" xmlns="http://www.w3.org/2000/svg" class="mr-2 h-7 w-7" fill="currentColor" viewBox="0 0 107.07 122.88" style="enable-background: new 0 0 107.07 122.88" xml:space="preserve">
            <g>
              <path d="M31.54,86.95c-1.74,0-3.16-1.43-3.16-3.19c0-1.76,1.41-3.19,3.16-3.19h20.5c1.74,0,3.16,1.43,3.16,3.19 c0,1.76-1.41,3.19-3.16,3.19H31.54L31.54,86.95z M31.54,42.27c-1.74,0-3.15-1.41-3.15-3.15c0-1.74,1.41-3.15,3.15-3.15h41.61 c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54L31.54,42.27z M56.85,116.58c1.74,0,3.15,1.41,3.15,3.15 c0,1.74-1.41,3.15-3.15,3.15H7.33c-2.02,0-3.85-0.82-5.18-2.15C0.82,119.4,0,117.57,0,115.55V7.33c0-2.02,0.82-3.85,2.15-5.18 C3.48,0.82,5.31,0,7.33,0h90.02c2.02,0,3.85,0.82,5.18,2.15c1.33,1.33,2.15,3.16,2.15,5.18V72.6c0,1.74-1.41,3.15-3.15,3.15 s-3.15-1.41-3.15-3.15V7.33c0-0.28-0.12-0.54-0.3-0.73c-0.19-0.19-0.45-0.3-0.73-0.3H7.33c-0.28,0-0.54,0.12-0.73,0.3 C6.42,6.8,6.3,7.05,6.3,7.33v108.21c0,0.28,0.12,0.54,0.3,0.73c0.19,0.19,0.45,0.3,0.73,0.3H56.85L56.85,116.58z M83.35,83.7 c0-1.73,1.41-3.14,3.14-3.14c1.73,0,3.14,1.41,3.14,3.14l-0.04,14.36l14.34,0.04c1.73,0,3.14,1.41,3.14,3.14s-1.41,3.14-3.14,3.14 l-14.35-0.04l-0.04,14.34c0,1.73-1.41,3.14-3.14,3.14c-1.73,0-3.14-1.41-3.14-3.14l0.04-14.35l-14.34-0.04 c-1.73,0-3.14-1.41-3.14-3.14c0-1.73,1.41-3.14,3.14-3.14l14.36,0.04L83.35,83.7L83.35,83.7z M31.54,64.59 c-1.74,0-3.15-1.41-3.15-3.15c0-1.74,1.41-3.15,3.15-3.15h41.61c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54 L31.54,64.59z" />
            </g>
          </svg>
          <span>Upload</span>
        </div>
      </div>
      <!-- <p>{{ moduleUrl }}</p> -->

      <!-- Options -->
      <div class="flex w-full flex-col items-center justify-center bg-[#f9f9f9] py-5" :class="uploadLoading === '' ? 'hidden' : 'block'">
        <div class="flex h-7 w-80 items-center rounded-full border bg-gray-200 px-3 shadow-lg duration-300">
          <p class="h-[14px] w-0 rounded-full text-center duration-500" :class="uploadLoading !== 100 ? 'bg-[#b53836ff]' : 'bg-green-500'" :style="{ width: uploadLoading + '%' }"></p>
        </div>
        <span class="mt-2 font-semibold duration-300" :class="uploadLoading !== 100 ? 'text-black' : 'text-green-500'">{{ uploadLoading !== 100 ? 'Uploading' : 'Uploading Complete' }} </span>
      </div>
      <div class="h-full bg-[#f9f9f9ff] px-20">
        <div class="mb-20 bg-white">
          <h3 class="flex items-center justify-start px-10 py-5 text-lg font-semibold text-gray-color">
            <img src="../assets/images/wrench.png" alt="" class="mr-5 h-5 w-5" />
            <span>OPTIONS</span>
          </h3>
          <!-- video options -->
          <VideoOptionComponent />
          <!-- audio options -->
          <AudioOptionComponent />
          <!-- Subtitles options -->
          <SubtitlesComponent :class="GlobalData.selectedFormat === '.webm' || GlobalData.selectedFormat === '.wmv' || GlobalData.selectedFormat === '.avi' || GlobalData.selectedFormat === '.flv' ? 'hidden' : 'block'" />
          <!-- Trim -->
          <h3 class="flex items-center justify-start bg-[#f1f1f1f1] px-10 py-3 text-lg font-semibold text-gray-color">
            <img src="../assets/images/scissors.png" alt="" class="mr-5 h-5 w-5" />
            Trim
          </h3>
          <div class="grid gap-8 px-10 py-7 md:grid-cols-2">
            <div class="grid grid-cols-4 items-center justify-center text-gray-color">
              <label for="">Trim&nbsp;Start</label>
              <input type="text" name="StartingTime" id="" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none" placeholder="Trim Start (HH:MM:SS)" />
            </div>
            <div class="grid grid-cols-4 items-center justify-center text-gray-color">
              <label for="">Trim&nbsp;End</label>
              <input type="text" name="EndingTime" id="" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none" placeholder="Trim End (HH:MM:SS)" />
            </div>
          </div>
          <!-- Watermark -->
          <h3 class="flex items-center justify-start bg-[#f1f1f1f1] px-10 py-3 text-lg font-semibold text-gray-color">
            <img src="../assets/images/stamp.png" alt="" class="mr-5 h-5 w-5" />
            Watermark
          </h3>
          <div class="grid gap-8 px-10 py-7 md:grid-cols-2">
            <div class="grid grid-cols-4 justify-center text-gray-color">
              <label for="" class="mr-2 mt-2 text-15px">Watermark Image</label>
              <div class="col-span-3 flex flex-col">
                <div class="relative h-[42px] w-full cursor-pointer rounded-lg border border-[#dadadaff] text-center">
                  <input @change="handleFileChange" name="waterMarkImage" accept="image/png" type="file" class="absolute bottom-0 left-0 right-0 top-0 cursor-pointer border bg-[#ccc] text-[#777] opacity-0" />
                  <span class="pointer-events-none absolute left-0 min-w-[100px] rounded-r rounded-bl-none rounded-tl-none px-4 py-2">{{ fileName }}</span>
                  <label class="pointer-events-none absolute right-0 w-32 rounded-r-lg border-l border-[#dadadaff] bg-[#f2f2f2ff] px-4 py-2">Browse</label>
                </div>
                <span class="mt-2 inline-flex text-xs text-light-gray">Watermark image file (PNG).</span>
                <p v-if="markWrongFormat" class="mt-5 text-sm text-red-600">Wrong file format. Please use png files for the waterMark.</p>
              </div>
            </div>
          </div>
          <!-- Other -->
          <OthersComponent />
          <!-- Convert -->

          <div class="mt-14 flex flex-col items-center justify-center">
            <p class="mb-10 mt-5 text-center text-red-600" :class="errMessage === '' ? 'hidden' : 'block'">{{ errMessage }}</p>
            <button type="submit" class="flex w-44 items-center justify-center rounded-lg border-0 bg-[#b53836ff] bg-opacity-75 px-8 py-4 text-white outline-none duration-200 hover:bg-opacity-100 hover:shadow-xl focus:outline-none" :disabled="fileSizeExceeded === true || markWrongFormat === true">
              <ConvertIcon />
              <span>Convert</span>
            </button>
            <!-- loading -->
            <div class="flex w-full flex-col items-center justify-center py-5" :class="progressElement === 0 ? 'hidden' : 'block'">
              <div class="flex h-7 w-80 items-center rounded-full bg-gray-200 px-3 shadow-lg duration-300">
                <p class="h-[14px] w-0 rounded-full text-center duration-500" :class="progressElement !== 100 ? 'bg-[#b53836ff]' : 'bg-green-500'" :style="{ width: progressElement + '%' }"></p>
              </div>
              <span class="mt-2 font-semibold duration-300" :class="progressElement !== 100 ? 'text-black' : 'text-green-500'">{{ progressElement !== 100 ? 'Converting' : 'Conversion Complete' }} </span>
            </div>
            <!-- Convert -->
            <a @click="downloadClick()" :target="GlobalData.selectedFormat === '.webm' ? '_blank' : ''" :href="downloadUrlNode" id="downloadBtn" :download="downloadName" class="mt-3 flex w-44 rounded-lg border-0 bg-green-500 bg-opacity-75 px-8 py-4 text-white outline-none duration-200 hover:bg-opacity-100 hover:text-white hover:shadow-xl focus:outline-none">
              <DownloadIcon />
              Download</a
            >
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import io from 'socket.io-client';
// components
import VideoOptionComponent from '../../src/components/VideoOptionComponent.vue';
import AudioOptionComponent from '../../src/components/AudioOptionComponent.vue';
import OthersComponent from '../../src/components/OthersComponent.vue';
import SubtitlesComponent from '../../src/components/SubtitlesComponent.vue';
// icons
import DownloadIcon from '../../src/assets/icons/DownloadIcon.vue';
import ConvertIcon from '../../src/assets/icons/ConvertIcon.vue';
// global store
import { useGlobalStore } from '../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

console.log('1');
// const moduleUrl = import.meta.env.VITE_ROOT_URL;
const fileName = ref('Choosen a file...');
const markWrongFormat = ref(false);
const handleFileChange = (event) => {
  // changing name
  const nameValue = event.target.files[0];
  console.log(nameValue);
  fileName.value = nameValue.name;
  // checking type
  if (nameValue.type !== 'image/png') {
    markWrongFormat.value = true;
  } else {
    markWrongFormat.value = false;
  }
};

// const fileInputRef = ref(null);
const showConvertButton = ref(true);
const downloadClick = () => {
  if (showConvertButton === true) {
    showConvertButton.value = !showConvertButton.value;
  }
  console.log(showConvertButton);
};

// getting response from the socket.io
const progressElement = ref(0);
// const socket = io('https://video-converter-api.vercel.app');
onMounted(() => {
  // socket.on('message', (message) => {
  //   console.log('Received message from server:', message);
  // });
  // socket.on('progress', (progressPercent) => {
  //   console.log('Progress:', progressPercent);
  //   progressElement.value = progressPercent;
  // });
});

const formSubmitted = ref(false);
const downloadUrlNode = ref('');
const downloadName = ref('');
const uploadLoading = ref('');
const errMessage = ref('');
const sendFile = async () => {
  const form = document.querySelector('form');
  const formData = new FormData(form);

  axios
    .post('https://video-converter-api.vercel.app/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        uploadLoading.value = percentCompleted;
        console.log(uploadLoading.value);
      },
    })
    .then((response) => {
      console.log(response.data);

      downloadUrlNode.value = 'https://video-converter-api.vercel.app/' + response.data.downloadUrl;
      downloadName.value = response.data.fileName;
      errMessage.value = response.data.message;
    })
    .catch((error) => {
      console.error('An error occurred:', error);
    });

  // socket.emit('message', 'File Upload Started');
  formSubmitted.value = true;
};

// file size check
const fileSizeExceeded = ref(false);
const fileSize = ref(null);
const checkFileSize = (event) => {
  const file = event.target.files[0];
  if (file.size > 50000000) {
    fileSizeExceeded.value = true;
    fileSize.value = null;
  } else {
    fileSizeExceeded.value = false;
    fileSize.value = file.size;
  }
};

// // refresh window notify
// onMounted(() => {
//   window.addEventListener('beforeunload', function (e) {
//     fetch('/refresh-detected', {
//       method: 'POST',
//     });
//   });
// });
</script>
