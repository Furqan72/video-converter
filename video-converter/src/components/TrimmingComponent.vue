<template>
  <div>
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
  </div>
</template>
