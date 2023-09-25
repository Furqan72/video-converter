<template>
  <div class="grid h-[350px] bg-[#363636ff] px-28 pt-20 text-white lg:grid-cols-2">
    <div class="maxlg:text-center">
      <h1 class="text-3xl font-bold">Transform MP4 Files into a Variety of Formats.</h1>
      <p class="py-2">Unleash Your Media Potential with Our Comprehensive Video Conversion Services</p>
    </div>
    <div class="flex justify-center text-center maxlg:pb-12">
      <div class="mt-10 font-semibold">
        <span class="mr-3">Convert</span>
        <select name="" id="" class="w-36 rounded-lg border bg-[#363636ff] px-4 py-3 text-lg outline-none">
          <option value="mp4">MP4</option>
        </select>
        <span class="mx-3">to</span>
        <select @change="GlobalData.updateSelectedFormat" name="selectMenu" id="" class="w-36 rounded-lg border bg-[#363636ff] px-4 py-3 text-lg outline-none">
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
</template>

<script setup>
import { useGlobalStore } from '../../../src/Store/GlobalStore.js';

const GlobalData = useGlobalStore();
</script>
