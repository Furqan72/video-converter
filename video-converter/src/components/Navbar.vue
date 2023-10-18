<template>
  <nav class="relative z-50 flex items-center justify-between bg-[#303030ff] px-28 py-5 text-white shadow-sm">
    <div class="flex items-center gap-x-24">
      <div class="flex cursor-pointer items-center text-xl">
        <img src="../assets/images/nav_icon.png" alt="" class="mr-2 w-12" />
        <p class="font-bold">Video Converter</p>
      </div>
      <ul class="font-semibol flex justify-between gap-x-10 maxlg:hidden [&>*]:flex [&>*]:cursor-pointer [&>*]:items-center">
        <li class="" @click="show = !show">Tools<ChevronDownIcon class="ml-2" /></li>
        <li class="">Api<ChevronDownIcon class="ml-2" /></li>
        <li class="">Pricing</li>
      </ul>
    </div>

    <Transition class="absolute left-0 right-0 top-[71px] bg-[#303030ff]">
      <div v-if="show" class="grid grid-cols-8 gap-10 px-28 py-6">
        <div class="col-span-4">
          <p class="broder broder-[#5a5a5a] flex items-center border-b text-lg font-semibold"><img src="../../src/assets/images/covnerter.png" alt="" class="mr-1 h-4 w-4" />CONVERT FILES</p>
          <div class="grid grid-cols-2 gap-5 py-2 [&>*]:text-sm">
            <ul class="[&>*]:rounded-sm [&>*]:p-[10px] [&>*]:duration-200 hover:[&>*]:bg-white hover:[&>*]:text-black">
              <li><a href="">Image Converter</a></li>
              <li><a href="">Video Converter</a></li>
              <li><a href="">Archive Converter</a></li>
              <li><a href="">Audio Converter</a></li>
              <li><a href="">CAD Converter</a></li>
              <li><a href="">Document Converter</a></li>
            </ul>
            <ul class="[&>*]:rounded-sm [&>*]:p-[10px] [&>*]:duration-200 hover:[&>*]:bg-white hover:[&>*]:text-black">
              <li><a href="">Ebook Converter</a></li>
              <li><a href="">Font Converter</a></li>
              <li><a href="">Presentation Converter</a></li>
              <li><a href="">Spreadsheet Converter</a></li>
              <li><a href="">Vector Converter</a></li>
            </ul>
          </div>
        </div>
        <div class="col-span-2">
          <h4 class="broder broder-[#5a5a5a] flex items-center border-b text-lg font-semibold"><img src="../../src/assets/images/covnerter.png" alt="" class="mr-1 h-4 w-4" />OPTIMIZE FILES</h4>
          <ul class="mt-2 [&>*]:rounded-sm [&>*]:p-[10px] [&>*]:text-sm [&>*]:duration-200 hover:[&>*]:bg-white hover:[&>*]:text-black">
            <li><a href="">Compress PDF</a></li>
            <li><a href="">Compress PNG</a></li>
            <li><a href="">Compress JPG</a></li>
          </ul>
          <h4 class="broder broder-[#5a5a5a] mt-2 flex items-center border-b text-lg font-semibold"><img src="../../src/assets/images/covnerter.png" alt="" class="mr-1 h-4 w-4" />Archives</h4>
          <ul class="mt-2 [&>*]:rounded-sm [&>*]:p-[10px] [&>*]:text-sm [&>*]:duration-200 hover:[&>*]:bg-white hover:[&>*]:text-black">
            <li><a href="">Create Archive</a></li>
            <li><a href="">Extract Archive</a></li>
          </ul>
        </div>
        <div class="col-span-2">
          <h4 class="broder broder-[#5a5a5a] flex items-center border-b text-lg font-semibold"><img src="../../src/assets/images/covnerter.png" alt="" class="mr-1 h-4 w-4" />Capture Websites</h4>
          <ul class="mt-2 [&>*]:rounded-sm [&>*]:p-[10px] [&>*]:text-sm [&>*]:duration-200 hover:[&>*]:bg-white hover:[&>*]:text-black">
            <li><a href="">Save Website as PDF</a></li>
            <li><a href="">Website PNG Screenshot</a></li>
            <li><a href="">Website JPG Screenshot</a></li>
          </ul>
          <h4 class="broder broder-[#5a5a5a] mt-2 flex items-center border-b text-lg font-semibold"><img src="../../src/assets/images/covnerter.png" alt="" class="mr-1 h-4 w-4" />Merge Files</h4>
          <ul class="mt-2 [&>*]:rounded-sm [&>*]:p-[10px] [&>*]:text-sm [&>*]:duration-200 hover:[&>*]:bg-white hover:[&>*]:text-black">
            <li><a href="" class="dropdown-item">Merge PDF</a></li>
          </ul>
        </div>
      </div>
    </Transition>

    <ul class="flex gap-10 [&>*]:cursor-pointer [&>*]:font-semibold">
      <li>Sign Up</li>
      <li>Login</li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
// icons
import DownloadIcon from '../../src/assets/icons/DownloadIcon.vue';
import ChevronDownIcon from '../../src/assets/icons/ChevronDownIcon.vue';

const show = ref(false);

// const navbarMenu = ref([
//   { category: 'CONVERT FILES1', icon: 'covnert', listitems1: 'Image Converter', listitems2: 'Image Converter', listitems3: 'Audio Converter', listitems4: 'CAD Converter', listitems5: 'Document Converter', listitems6: 'Archive Converter' },
//   { category: 'CONVERT FILES2', icon: 'covnert', listitems1: 'a' },
//   { category: 'CONVERT FILES3', icon: 'covnert', listitems1: 'a' },
// ]);

//
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
