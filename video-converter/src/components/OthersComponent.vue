<template>
  <div>
    <!-- Other -->
    <h3 class="flex items-center justify-start bg-[#f1f1f1f1] px-10 py-3 text-lg font-semibold text-gray-color">
      <img src="../assets/images/setting.png" alt="" class="mr-5 h-5 w-5" />
      Other
    </h3>
    <div class="grid gap-x-8 gap-y-6 px-10 py-7 coxl:grid-cols-2">
      <div class="grid grid-cols-4 justify-center text-gray-color">
        <label for="" class="mr-2 mt-2 text-15px">Keyframe Interval</label>
        <div class="col-span-3 flex flex-col">
          <input type="text" name="KeyframeInterval" class="w-full rounded-lg border px-4 py-2 outline-none" placeholder="" />
          <span class="mt-2 text-xs text-light-gray">Set the number of frames after a keyframe is inserted at least.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
