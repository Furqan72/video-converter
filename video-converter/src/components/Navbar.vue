<template>
  <nav class="flex justify-between items-center px-20 py-5 shadow-sm bg-[#303030ff] text-white">
    <div class="flex items-center gap-x-24">
      <div class="text-xl cursor-pointer flex items-center">
        <img src="../assets/images/nav_icon.png" alt="" class="w-12 mr-2">
        <p>Wodwes <span class="font-bold">Video Converter</span></p>
      </div>
      <ul class="flex justify-between gap-x-10 font-semibold [&>*]:flex [&>*]:items-center [&>*]:cursor-pointer">
        <li class=""><span class="mr-2">Tools</span><ChevronDownIcon /></li>
        <li class=""><span class="mr-2">Api</span><ChevronDownIcon /></li>
        <li class="">Pricing</li>
      </ul>
    </div>

    <ul class="flex gap-10 [&>*]:font-semibold  [&>*]:cursor-pointer">
      <li>Sign Up</li>
      <li>Login</li>
    </ul>
  </nav>
</template>

<script setup>
import ChevronDownIcon from "../assets/icons/ChevronDownIcon.vue";

</script>