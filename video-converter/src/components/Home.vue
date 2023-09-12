<template>
  <div>
    <form @submit.prevent="sendFile">
      <div class="grid h-[350px] bg-[#363636ff] px-20 pt-20 text-white lg:grid-cols-2">
        <div class="maxlg:text-center">
          <h1 class="text-3xl font-bold">Transform MP4 Files into a Variety of Formats.</h1>
          <p class="py-2">Unleash Your Media Potential with Our Comprehensive Video Conversion Services</p>
        </div>
        <div class="maxlg:pb-12 flex justify-center text-center">
          <div class="mt-10 font-semibold">
            <span class="mr-3">Convert</span>
            <select name="" id="" class="w-40 rounded-lg border bg-[#363636ff] px-4 py-3 text-lg outline-none">
              <option value="mp4">MP4</option>
            </select>
            <span class="mx-3">to</span>
            <select name="selectMenu" id="" class="w-40 rounded-lg border bg-[#363636ff] px-4 py-3 text-lg outline-none">
              <option value=".avi">AVI</option>
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
      <p v-if="fileSizeExceeded" class="mt-5 text-center text-red-600">File size exceeded the limit of 25 MB</p>
      <div class="flex justify-center bg-[#f9f9f9] px-20 py-10 lg:py-7">
        <div class="fileUpload relative flex w-48 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#b53836ff] py-4 text-xl text-white duration-300 hover:font-semibold hover:shadow-2xl">
          <input type="file" name="videoFile" class="upload absolute bottom-0 left-0 right-0 top-0 m-0 cursor-pointer p-0 opacity-0 filter-none" @change="checkFileSize" required />
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
      <div class="bg-[#f9f9f9] px-20 py-10 lg:py-7">
        <div class="mb-20 bg-white">
          <h3 class="text-gray-color flex items-center justify-start px-10 py-5 text-lg font-semibold">
            <img src="../assets/images/wrench.png" alt="" class="mr-5 h-5 w-5" />
            <span>OPTIONS</span>
          </h3>
          <!-- video -->
          <h3 class="text-gray-color flex items-center justify-start bg-[#f1f1f1ff] px-10 py-3 text-lg font-semibold">
            <img src="../assets/images/video-camera.png" alt="" class="mr-5 h-5 w-5" />
            Video
          </h3>
          <div class="grid gap-8 px-10 py-7 md:grid-cols-2">
            <div class="text-gray-color grid grid-cols-4 items-center justify-center">
              <label for="">Resolution</label>
              <select name="ResolutionMenu" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none">
                <option v-for="(option, index) in resolutionOptions" :key="index" :value="option.value">{{ option.label }}</option>
              </select>
            </div>
            <div class="text-gray-color grid grid-cols-4 items-center justify-center">
              <label for="">Aspect&nbsp;Ratio</label>
              <select name="AspectRatioSelect" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none">
                <option v-for="(option, index) in aspectRatioOptions" :key="index" :value="option.value">{{ option.label }}</option>
              </select>
            </div>
            <div class="text-gray-color grid grid-cols-4 items-center justify-center">
              <label for="">Constant&nbsp;Quality (CRF)</label>
              <select name="ConstantQualitySelect" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none">
                <option v-for="(option, index) in constantQualityOptions" :key="index" :value="option.value">{{ option.label }}</option>
              </select>
            </div>
            <div class="text-gray-color grid grid-cols-4 items-center justify-center">
              <label for="">Video&nbsp;Codec</label>
              <select name="videotCodecSelect" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none">
                <option v-for="(option, index) in videotCodecOptions" :key="index" :value="option.value">{{ option.label }}</option>
              </select>
            </div>
          </div>
          <!--  -->
          <!-- trim -->
          <h3 class="text-gray-color flex items-center justify-start bg-[#f1f1f1ff] px-10 py-3 text-lg font-semibold">
            <img src="../assets/images/scissors.png" alt="" class="mr-5 h-5 w-5" />
            Trim
          </h3>
          <div class="grid gap-8 px-10 py-7 md:grid-cols-2">
            <div class="text-gray-color grid grid-cols-4 items-center justify-center">
              <label for="">Trim&nbsp;Start</label>
              <input type="text" name="StartingTime" id="" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none" placeholder="Trim Start (HH:MM:SS)" />
            </div>
            <div class="text-gray-color grid grid-cols-4 items-center justify-center">
              <label for="">Trim&nbsp;End</label>
              <input type="text" name="EndingTime" id="" class="col-span-3 w-full rounded-lg border px-4 py-2 outline-none" placeholder="Trim End (HH:MM:SS)" />
            </div>
          </div>
          <div class="mt-24 flex flex-col items-center justify-center">
            <button type="submit" class="flex w-44 items-center justify-center rounded-lg border-0 bg-[#b53836ff] bg-opacity-75 px-8 py-4 text-white outline-none duration-200 hover:bg-opacity-100 hover:shadow-xl focus:outline-none" :disabled="fileSizeExceeded === true" v-if="!formSubmitted">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112.62 120.72" width="20" height="20" class="mr-3" fill="currentColor">
                <path d="M11.64,100.12l-.4-.47-1.06,8.63a5.08,5.08,0,0,1-1.92,3.41A5.11,5.11,0,0,1,0,107L2.79,84.65v-.07a3.28,3.28,0,0,1,.08-.41h0A5.09,5.09,0,0,1,9,80.39q11.22,2.53,22.42,5.15a5,5,0,0,1,3.17,2.25,5.14,5.14,0,0,1,.64,3.84v0a5,5,0,0,1-2.25,3.16,5.08,5.08,0,0,1-3.83.65c-3.31-.75-6.62-1.52-9.92-2.28a40.71,40.71,0,0,0,2.84,3,50.09,50.09,0,0,0,26.23,13.49,48.67,48.67,0,0,0,14.71.34A47.35,47.35,0,0,0,77,106h0q2.52-1.19,4.83-2.54c1.56-.93,3.07-1.92,4.51-3a50.8,50.8,0,0,0,8.56-7.88,48.92,48.92,0,0,0,6.39-9.45l.56-1.1,10,2.69-.8,1.66a58.64,58.64,0,0,1-7.9,12.24,61.28,61.28,0,0,1-10.81,10.1c-1.68,1.23-3.46,2.4-5.32,3.5s-3.73,2.07-5.74,3a58,58,0,0,1-17,5,58.56,58.56,0,0,1-17.79-.39,60.21,60.21,0,0,1-31.58-16.26c-1.2-1.16-2.26-2.31-3.24-3.45ZM101,20.6l.4.47,1-8.63a5.11,5.11,0,1,1,10.14,1.26l-2.74,22.37,0,.07c0,.13,0,.27-.07.41h0a5.09,5.09,0,0,1-6.08,3.78c-7.47-1.69-15-3.4-22.42-5.15a5,5,0,0,1-3.16-2.25,5.1,5.1,0,0,1-.65-3.84v0a5,5,0,0,1,2.25-3.16,5.1,5.1,0,0,1,3.84-.65c3.31.75,6.61,1.52,9.92,2.28-.84-1-1.77-2-2.84-3.05a50.09,50.09,0,0,0-12.13-8.73A49.49,49.49,0,0,0,64.37,11a48.6,48.6,0,0,0-14.7-.34,47.26,47.26,0,0,0-14,4.1h0q-2.53,1.18-4.83,2.54c-1.57.93-3.07,1.92-4.52,3a50.34,50.34,0,0,0-8.55,7.88,48,48,0,0,0-6.39,9.45l-.57,1.1L.76,36l.8-1.66A58.9,58.9,0,0,1,9.46,22.1,61.63,61.63,0,0,1,20.27,12q2.54-1.85,5.32-3.5c1.81-1.06,3.73-2.07,5.74-3a58,58,0,0,1,17-5A58.56,58.56,0,0,1,66.16.89a59.77,59.77,0,0,1,17,5.74A60.4,60.4,0,0,1,97.75,17.15c1.19,1.16,2.26,2.31,3.24,3.45Z" />
              </svg>
              <span>Convert</span>
            </button>
            <a :href="downloadUrlNode" id="downloadBtn" :download="downloadName" class="mt-3 flex w-44 rounded-lg border-0 bg-[#b53836ff] bg-opacity-75 px-8 py-4 text-white outline-none duration-200 hover:bg-opacity-100 hover:text-white hover:shadow-xl focus:outline-none" v-else>
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 110.9" width="20" height="20" class="mr-4" fill="currentColor">
                <g><path class="st0" d="M13.09,35.65h30.58V23.2l34.49,0v12.45l31.47,0L61.39,82.58L13.09,35.65L13.09,35.65z M61.44,97.88l47.51-0.14 l4.54-21.51l9.38,0.31v34.36L0,110.9V76.55l9.39-0.31l4.54,21.51L61.44,97.88L61.44,97.88L61.44,97.88z M43.67,0h34.49v4.62H43.67 V0L43.67,0z M43.67,9.32h34.49v9.44H43.67V9.32L43.67,9.32z" /></g>
              </svg>
              Download</a
            >
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
// import { io } from 'socket.io-client';
// const newSocket = io;

// resolution
const resolutionOptions = ref([
  { value: 'no change', label: 'no change' },
  { value: '320x240', label: '320x240 (240p)' },
  { value: '640x480', label: '640x480 (480p)' },
  { value: '854x480', label: '854x480' },
  { value: '960x720', label: '960x720' },
  { value: '1280x720', label: '1280x720 (720p HD)' },
  { value: '1440x1080', label: '1440x1080' },
  { value: '1920x1080', label: '1920x1080 (1080p Full HD)' },
  { value: '2560x1440', label: '2560x1440 (1440p 2K WQHD)' },
  { value: '3840x2160', label: '3840x2160 (2160p 4K UHD)' },
  { value: 'custom', label: 'custom' },
]);
// aspect ratio
const aspectRatioOptions = ref([
  { value: '', label: 'no change' },
  { value: '16:9', label: '16:9' },
  { value: '14:9', label: '14:9' },
  { value: '4:3', label: '4:3' },
]);
// constant quality
const constantQualityOptions = ref([
  { value: '0', label: '0 (lossless compression)' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' },
  { value: '13', label: '13' },
  { value: '14', label: '14' },
  { value: '15', label: '15' },
  { value: '16', label: '16' },
  { value: '17', label: '17' },
  { value: '18', label: '18 (high quality)' },
  { value: '19', label: '19' },
  { value: '20', label: '20' },
  { value: '21', label: '21' },
  { value: '22', label: '22' },
  { value: '23', label: '23 (normal quality)' },
  { value: '24', label: '24' },
  { value: '25', label: '25' },
  { value: '26', label: '26' },
  { value: '27', label: '27' },
  { value: '28', label: '28 (low quality)' },
  { value: '29', label: '29' },
  { value: '30', label: '30' },
  { value: '31', label: '31' },
  { value: '32', label: '32' },
  { value: '33', label: '33' },
  { value: '34', label: '34' },
  { value: '35', label: '35' },
  { value: '36', label: '36' },
  { value: '37', label: '37' },
  { value: '38', label: '38' },
  { value: '39', label: '39' },
  { value: '40', label: '40' },
  { value: '41', label: '41' },
  { value: '42', label: '42' },
  { value: '43', label: '43' },
  { value: '44', label: '44' },
  { value: '45', label: '45' },
  { value: '46', label: '46' },
  { value: '47', label: '47' },
  { value: '48', label: '48' },
  { value: '49', label: '49' },
  { value: '50', label: '50' },
  { value: '51', label: '51 (worst quality)' },
]);
//  video COdec
const videotCodecOptions = ref([
  { value: 'libx264', label: 'x264' },
  { value: 'copy', label: 'Copy (No Re-encoding)' },
  { value: 'libx265', label: 'x265' },
  { value: 'libvpx', label: 'vp8' },
  { value: 'libvpx-vp9', label: 'vp9' },
  { value: 'libaom-av1', label: 'av1' },
]);

// file size check
const fileSizeExceeded = ref(false);
const fileSize = ref(null);
const checkFileSize = (event) => {
  const file = event.target.files[0];
  if (file.size > 25000000) {
    fileSizeExceeded.value = true;
    fileSize.value = null;
  } else {
    fileSizeExceeded.value = false;
    fileSize.value = file.size;
  }
};

const showDownloadButton = ref(false);
const formSubmitted = ref(false);
const downloadUrlNode = ref('');
const downloadName = ref('');
const sendFile = () => {
  const form = document.querySelector('form');
  const formData = new FormData(form);

  axios
    .post('http://localhost:4000/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    })
    .then((response) => {
      console.log(response.data);
      console.log(response.data.downloadUrl);

      downloadUrlNode.value = 'http://localhost:4000/' + response.data.downloadUrl;
      downloadName.value = response.data.fileName;

      const showDownloadButton = ref(false);
    });
  // .delete(`http://localhost:4000/delete-file/example.mp4`);
  // .catch((error) => {
  //   console.error('Error:', error);
  // });
  formSubmitted.value = true;
};
</script>
