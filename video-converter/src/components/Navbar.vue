<template>
  <nav class="flex items-center justify-between bg-[#303030ff] px-28 py-5 text-white shadow-sm">
    <div class="flex items-center gap-x-24">
      <div class="flex cursor-pointer items-center text-xl">
        <img src="../assets/images/nav_icon.png" alt="" class="mr-2 w-12" />
        <p class="font-bold">Video Converter</p>
      </div>
      <ul class="font-semibol flex justify-between gap-x-10 maxlg:hidden [&>*]:flex [&>*]:cursor-pointer [&>*]:items-center">
        <li class=""><span class="mr-2">Tools</span><ChevronDownIcon /></li>
        <li class=""><span class="mr-2">Api</span><ChevronDownIcon /></li>
        <li class="">Pricing</li>
      </ul>
    </div>

    <ul class="flex gap-10 [&>*]:cursor-pointer [&>*]:font-semibold">
      <li>Sign Up</li>
      <li>Login</li>
    </ul>
  </nav>
</template>

<script setup>
// icons
import DownloadIcon from '../../src/assets/icons/DownloadIcon.vue';
import ChevronDownIcon from '../../src/assets/icons/ChevronDownIcon.vue';
</script>
