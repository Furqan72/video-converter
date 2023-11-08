<template>
  <div>
    <div class="flex items-center justify-between px-10 py-5 text-lg text-gray-color">
      <h3 class="peer flex items-center justify-start font-bold">
        <img src="../../assets/images/wrench.png" alt="" class="mr-[14px] h-5 w-5" />
        <span>OPTIONS</span>
      </h3>
      <div class="relative" @mouseover="showTooltip = true" @mouseout="showTooltip = false">
        <img src="../../assets/images/question.png" alt="" class="h-5 w-5" />
        <p v-if="showTooltip" class="absolute -right-24 -top-[102px] w-56 rounded-[4px] bg-gray-900 px-4 py-2 text-center text-sm text-white duration-300">Setting these options is optional. The default values are a good start for most cases.</p>
        <span v-if="showTooltip" class="absolute -top-[14px] left-[3px] h-3 w-3 rotate-45 bg-gray-900 duration-300"></span>
      </div>
    </div>
    <!-- width -->
    <div class="grid gap-x-8 gap-y-6 px-10 py-7 coxl:grid-cols-2">
      <div class="grid grid-cols-4 justify-center text-gray-color">
        <label class="mr-2 mt-2 text-15px">Width</label>
        <div class="col-span-3 flex flex-col">
          <input type="number" name="width" class="w-full rounded-lg border px-4 py-2 outline-none" value="500" />
          <span class="mt-2 text-xs text-light-gray">Output width in pixels.</span>
        </div>
      </div>
      <!-- height -->
      <div class="grid grid-cols-4 justify-center text-gray-color">
        <label class="mr-2 mt-2 text-15px">Height</label>
        <div class="col-span-3 flex flex-col">
          <input type="number" name="height" class="w-full rounded-lg border px-4 py-2 outline-none" value="500" />
          <span class="mt-2 text-xs text-light-gray">Output height in pixels.</span>
        </div>
      </div>
      <!-- fit  -->
      <div class="grid grid-cols-4 justify-center text-gray-color">
        <label class="mr-2 mt-2 text-15px">Fit</label>
        <div class="col-span-3 flex flex-col">
          <select name="fit" class="w-full rounded-lg border px-4 py-2 outline-none">
            <option value="inside">max</option>
            <option value="cover">crop</option>
            <option value="fill">scale</option>
          </select>
          <span class="mt-2 text-xs text-light-gray">Sets the mode of resizing the image. "Max" resizes the image to fit within the width and height, but will not increase the size of the image if it is smaller than width or height. "Crop" resizes the image to fill the width and height dimensions and crops any excess image data. "Scale" enforces the image width and height by scaling.</span>
        </div>
      </div>
      <!-- strip -->
      <div class="grid grid-cols-4 justify-center text-gray-color">
        <label class="mr-2 mt-2 text-15px">Strip</label>
        <div class="col-span-3 flex flex-col">
          <div class="flex items-center">
            <input type="radio" id="yes" name="strip" value="yes" class="mr-2 h-4 w-4 border outline-none" />
            <label for="yes" class="text-black">Yes</label>
          </div>
          <div class="flex items-center">
            <input type="radio" id="no" name="strip" value="no" class="mr-2 h-4 w-4 border outline-none" checked />
            <label for="no" class="text-black">No</label>
          </div>
          <span class="mt-2 text-xs text-light-gray">Remove any metadata such as EXIF data.</span>
        </div>
      </div>
      <!-- quality -->
      <div v-if="GlobalData.imageSelectedFormat === '.png' || GlobalData.imageSelectedFormat === '.webp' || GlobalData.imageSelectedFormat === '.jpg'" class="grid grid-cols-4 justify-center text-gray-color">
        <label class="mr-2 mt-2 text-15px">Quality</label>
        <div class="col-span-3 flex flex-col">
          <input type="number" name="quality" class="w-full rounded-lg border px-4 py-2 outline-none" :value="GlobalData.imageSelectedFormat === '.png' ? '75' : ''" />
          <span class="mt-2 text-xs text-light-gray">{{ GlobalData.imageSelectedFormat === '.png' ? 'Zlib compression level (quality / 10) and filter-type (quality % 10).' : 'WEBP compression level.' }}</span>
        </div>
      </div>
      <!-- auto orient -->
      <div v-if="GlobalData.selectedImageFileFormat === '.jpg'" class="grid grid-cols-4 justify-center text-gray-color">
        <label class="mr-2 mt-2 text-15px">Auto Orient</label>
        <div class="col-span-3 flex flex-col">
          <div class="flex items-center">
            <input type="radio" id="orientYes" name="orient" value="yes" class="mr-2 h-4 w-4 border outline-none" checked />
            <label for="orientYes" class="text-black">Yes</label>
          </div>
          <div class="flex items-center">
            <input type="radio" id="orientNo" name="orient" value="no" class="mr-2 h-4 w-4 border outline-none" />
            <label for="orientNo" class="text-black">No</label>
          </div>
          <span class="mt-2 text-xs text-light-gray">Automatically rotate the image correctly, based on EXIF information which usually is set using a gravity sensor in digital cameras.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue';
// global store
import { useGlobalStore } from '../../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();
const showTooltip = ref(false);
</script>
