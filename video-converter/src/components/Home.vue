<template>
  <div>
    <form @submit.prevent="sendFile">
      <!-- <form action="http://localhost:4000/convert" enctype="multipart/form-data" method="post"> -->
      <div class="grid h-[350px] grid-cols-2 bg-[#363636ff] px-20 pt-20 text-white">
        <div>
          <h1 class="text-3xl font-bold">Transform MP4 Files into a Variety of Formats.</h1>
          <p class="py-2">Unleash Your Media Potential with Our Comprehensive Video Conversion Services</p>
        </div>
        <div class="flex justify-center text-center">
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
      <div class="flex justify-center px-20 py-7">
        <div class="fileUpload relative flex w-60 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#b53836ff] py-5 text-white duration-300 hover:shadow-2xl">
          <input type="file" name="videoFile" class="upload absolute bottom-0 left-0 right-0 top-0 m-0 cursor-pointer p-0 opacity-0 filter-none" @change="checkFileSize" required />
          <svg :class="fileSize === null ? 'hidden' : 'block'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="mr-2" fill="currentColor" viewBox="0 0 104.69 122.88" style="enable-background: new 0 0 104.69 122.88" xml:space="preserve">
            <g><path d="M31.54,86.95c-1.74,0-3.16-1.43-3.16-3.19c0-1.76,1.41-3.19,3.16-3.19h20.5c1.74,0,3.16,1.43,3.16,3.19 c0,1.76-1.41,3.19-3.16,3.19H31.54L31.54,86.95z M31.54,42.27c-1.74,0-3.15-1.41-3.15-3.15c0-1.74,1.41-3.15,3.15-3.15h41.61 c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54L31.54,42.27z M66.57,108.66c-1.36-1.08-1.59-3.06-0.5-4.42 c1.08-1.36,3.06-1.59,4.42-0.5l9.57,7.59l18.21-22.27c1.1-1.35,3.09-1.54,4.43-0.44c1.35,1.1,1.54,3.09,0.44,4.43l-20.17,24.67l0,0 c-1.09,1.33-3.04,1.54-4.39,0.47L66.57,108.66L66.57,108.66z M56.85,116.58c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15 H7.33c-2.02,0-3.85-0.82-5.18-2.15C0.82,119.4,0,117.57,0,115.55V7.33c0-2.02,0.82-3.85,2.15-5.18C3.48,0.82,5.31,0,7.33,0h90.02 c2.02,0,3.85,0.82,5.18,2.15c1.33,1.33,2.15,3.16,2.15,5.18V72.6c0,1.74-1.41,3.15-3.15,3.15c-1.74,0-3.15-1.41-3.15-3.15V7.33 c0-0.28-0.12-0.54-0.3-0.73c-0.19-0.19-0.45-0.3-0.73-0.3H7.33c-0.28,0-0.54,0.12-0.73,0.3C6.42,6.8,6.3,7.05,6.3,7.33v108.21 c0,0.28,0.12,0.54,0.3,0.73c0.19,0.19,0.45,0.3,0.73,0.3H56.85L56.85,116.58z M31.54,64.59c-1.74,0-3.15-1.41-3.15-3.15 c0-1.74,1.41-3.15,3.15-3.15h41.61c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54L31.54,64.59z" /></g>
          </svg>
          <svg :class="fileSize === null ? 'block' : 'hidden'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="mr-2" fill="currentColor" viewBox="0 0 107.07 122.88" style="enable-background: new 0 0 107.07 122.88" xml:space="preserve">
            <g>
              <path d="M31.54,86.95c-1.74,0-3.16-1.43-3.16-3.19c0-1.76,1.41-3.19,3.16-3.19h20.5c1.74,0,3.16,1.43,3.16,3.19 c0,1.76-1.41,3.19-3.16,3.19H31.54L31.54,86.95z M31.54,42.27c-1.74,0-3.15-1.41-3.15-3.15c0-1.74,1.41-3.15,3.15-3.15h41.61 c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54L31.54,42.27z M56.85,116.58c1.74,0,3.15,1.41,3.15,3.15 c0,1.74-1.41,3.15-3.15,3.15H7.33c-2.02,0-3.85-0.82-5.18-2.15C0.82,119.4,0,117.57,0,115.55V7.33c0-2.02,0.82-3.85,2.15-5.18 C3.48,0.82,5.31,0,7.33,0h90.02c2.02,0,3.85,0.82,5.18,2.15c1.33,1.33,2.15,3.16,2.15,5.18V72.6c0,1.74-1.41,3.15-3.15,3.15 s-3.15-1.41-3.15-3.15V7.33c0-0.28-0.12-0.54-0.3-0.73c-0.19-0.19-0.45-0.3-0.73-0.3H7.33c-0.28,0-0.54,0.12-0.73,0.3 C6.42,6.8,6.3,7.05,6.3,7.33v108.21c0,0.28,0.12,0.54,0.3,0.73c0.19,0.19,0.45,0.3,0.73,0.3H56.85L56.85,116.58z M83.35,83.7 c0-1.73,1.41-3.14,3.14-3.14c1.73,0,3.14,1.41,3.14,3.14l-0.04,14.36l14.34,0.04c1.73,0,3.14,1.41,3.14,3.14s-1.41,3.14-3.14,3.14 l-14.35-0.04l-0.04,14.34c0,1.73-1.41,3.14-3.14,3.14c-1.73,0-3.14-1.41-3.14-3.14l0.04-14.35l-14.34-0.04 c-1.73,0-3.14-1.41-3.14-3.14c0-1.73,1.41-3.14,3.14-3.14l14.36,0.04L83.35,83.7L83.35,83.7z M31.54,64.59 c-1.74,0-3.15-1.41-3.15-3.15c0-1.74,1.41-3.15,3.15-3.15h41.61c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54 L31.54,64.59z" />
            </g>
          </svg>
          <span class="block text-xl font-semibold">Upload</span>
        </div>
      </div>
      <div class="mb-20 px-20 py-10">
        <h3 class="flex bg-[#f1f1f1ff] px-10 py-3 text-2xl font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" class="mr-10" fill="currentColor" viewBox="0 0 122.88 86.35" style="enable-background: new 0 0 122.88 86.35" xml:space="preserve">
            <g>
              <path class="st0" d="M43.12,36.55l-7.4,4.51l-5.27-3.46c-0.7-2.1-3.1-4.05-7.2-5.82L12.34,27C4.12,23.39,0,18.94,0,13.62 c0-2.83,1.06-5.23,3.17-7.18c2.11-1.95,4.69-2.94,7.7-2.94c4.3,0,8.08,1.45,11.32,4.35c3.23,2.9,4.84,6.29,4.84,10.12 c0,0.29-0.07,1.25-0.22,2.9l-0.05,1.2c-0.07,0.77-0.11,1.34-0.11,1.74c0,2.51,1.99,4.67,5.98,6.5c0.7,0.34,1.38,0.72,2.04,1.09 L43.12,36.55L43.12,36.55z M67.23,65.77l40.69,20.58l14.96-2.84L77.96,50.96c-4.84-3.5-4.88-4.35-10.79-2.64l-1.9,0.55l-11.21-6.25 l-7.78,4.97l12.14,8.59l0.77,2.64C60.54,63.47,62.95,63.6,67.23,65.77L67.23,65.77z M64.6,20.27L104.67,0l16.27,1.31L76.33,34.14 c-4.82,3.55-5.71,5.83-11.69,4.1l-2.61-0.76l-4.7,2.62l-12.87,7.47c-1.95,1.15-3.31,1.88-4.05,2.15l-1.15,0.43 c-3.01,1.11-4.51,3.12-4.51,6.02v0.49l0.11,1.31l0.16,2.58c0.23,4.74-2.33,9.37-7.72,13.84c-5.39,4.51-11.07,6.77-17.01,6.77 c-3.01,0-5.46-0.77-7.4-2.29C0.97,77.34,0,75.43,0,73.08c0-3.05,2.99-6.45,8.97-10.19L25.6,52.5c3.64-2.27,5.46-4.32,5.46-6.13 c0-0.22-0.04-0.56-0.09-1.06l14.69-9.16l0,0l9.52-5.97l0.92-3.17C57.36,22.66,60.64,22.27,64.6,20.27L64.6,20.27z M10.87,21.76 l2.56,1.26c2.31,1.09,4.19,1.63,5.62,1.63c2.8,0,4.19-1.95,4.19-5.88c0-2.87-1.29-5.52-3.89-7.93c-2.58-2.42-5.43-3.62-8.54-3.62 c-1.86,0-3.46,0.65-4.8,1.94C4.67,10.46,4,12,4,13.78C4,16.75,6.29,19.42,10.87,21.76L10.87,21.76z M21.53,59.6L9.51,67.08 C5.84,69.39,4,71.42,4,73.12c0,1.42,0.55,2.46,1.68,3.15c1.11,0.7,2.8,1.06,5.03,1.06c4.62,0,9.15-1.81,13.6-5.41 c4.44-3.6,6.66-7.27,6.66-11.02c0-2.53-1.11-3.78-3.31-3.78C26.33,57.12,24.29,57.95,21.53,59.6L21.53,59.6z M44.4,44.8 c1.7,0,2.56-0.82,2.56-2.47c0-1.65-0.86-2.47-2.56-2.47c-1.68,0-2.52,0.82-2.52,2.47C41.88,43.98,42.72,44.8,44.4,44.8L44.4,44.8z" />
            </g>
          </svg>
          Trim
        </h3>
        <div class="grid grid-cols-2 px-10 py-7">
          <div>
            <label for="">Trim Start</label>
            <input type="text" name="StartingTime" id="" class="ml-20 w-[250px] rounded-lg border px-4 py-2 outline-none" placeholder="Trim Start (00:00:00)" />
          </div>
          <div>
            <label for="">Trim End</label>
            <input type="text" name="EndingTime" id="" class="ml-20 w-[250px] rounded-lg border px-4 py-2 outline-none" placeholder="Trim End (00:00:00)" />
          </div>
        </div>
        <div class="mt-24 flex items-center justify-center">
          <button type="submit" class="flex rounded-lg border-0 bg-[#b53836ff] bg-opacity-75 px-8 py-4 text-white outline-none hover:bg-opacity-100 focus:outline-none" :disabled="fileSizeExceeded === true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112.62 120.72" width="20" height="20" class="mr-4" fill="currentColor">
              <path d="M11.64,100.12l-.4-.47-1.06,8.63a5.08,5.08,0,0,1-1.92,3.41A5.11,5.11,0,0,1,0,107L2.79,84.65v-.07a3.28,3.28,0,0,1,.08-.41h0A5.09,5.09,0,0,1,9,80.39q11.22,2.53,22.42,5.15a5,5,0,0,1,3.17,2.25,5.14,5.14,0,0,1,.64,3.84v0a5,5,0,0,1-2.25,3.16,5.08,5.08,0,0,1-3.83.65c-3.31-.75-6.62-1.52-9.92-2.28a40.71,40.71,0,0,0,2.84,3,50.09,50.09,0,0,0,26.23,13.49,48.67,48.67,0,0,0,14.71.34A47.35,47.35,0,0,0,77,106h0q2.52-1.19,4.83-2.54c1.56-.93,3.07-1.92,4.51-3a50.8,50.8,0,0,0,8.56-7.88,48.92,48.92,0,0,0,6.39-9.45l.56-1.1,10,2.69-.8,1.66a58.64,58.64,0,0,1-7.9,12.24,61.28,61.28,0,0,1-10.81,10.1c-1.68,1.23-3.46,2.4-5.32,3.5s-3.73,2.07-5.74,3a58,58,0,0,1-17,5,58.56,58.56,0,0,1-17.79-.39,60.21,60.21,0,0,1-31.58-16.26c-1.2-1.16-2.26-2.31-3.24-3.45ZM101,20.6l.4.47,1-8.63a5.11,5.11,0,1,1,10.14,1.26l-2.74,22.37,0,.07c0,.13,0,.27-.07.41h0a5.09,5.09,0,0,1-6.08,3.78c-7.47-1.69-15-3.4-22.42-5.15a5,5,0,0,1-3.16-2.25,5.1,5.1,0,0,1-.65-3.84v0a5,5,0,0,1,2.25-3.16,5.1,5.1,0,0,1,3.84-.65c3.31.75,6.61,1.52,9.92,2.28-.84-1-1.77-2-2.84-3.05a50.09,50.09,0,0,0-12.13-8.73A49.49,49.49,0,0,0,64.37,11a48.6,48.6,0,0,0-14.7-.34,47.26,47.26,0,0,0-14,4.1h0q-2.53,1.18-4.83,2.54c-1.57.93-3.07,1.92-4.52,3a50.34,50.34,0,0,0-8.55,7.88,48,48,0,0,0-6.39,9.45l-.57,1.1L.76,36l.8-1.66A58.9,58.9,0,0,1,9.46,22.1,61.63,61.63,0,0,1,20.27,12q2.54-1.85,5.32-3.5c1.81-1.06,3.73-2.07,5.74-3a58,58,0,0,1,17-5A58.56,58.56,0,0,1,66.16.89a59.77,59.77,0,0,1,17,5.74A60.4,60.4,0,0,1,97.75,17.15c1.19,1.16,2.26,2.31,3.24,3.45Z" />
            </svg>
            <span>Convert</span>
          </button>
        </div>
      </div>
    </form>
    <!-- <a href="" id="downloadBtn">download link</a> -->
    <a :href="downloadUrlNode" id="downloadBtn" :download="downloadName">download link</a>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
// import { io } from 'socket.io-client';
// const newSocket = io;

const fileSizeExceeded = ref(false);
const fileSize = ref(null);
// file size check
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
    });
  // .delete(`http://localhost:4000/delete-file/example.mp4`);
  // .catch((error) => {
  //   console.error('Error:', error);
  // });
};
</script>
