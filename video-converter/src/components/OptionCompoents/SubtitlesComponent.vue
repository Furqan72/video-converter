<template>
  <div>
    <h3 class="flex items-center justify-start bg-[#f1f1f1f1] px-10 py-3 text-lg font-bold text-gray-color">
      <img src="../../assets/images/closed-caption.png" alt="" class="mr-[14px] h-5 w-5" />
      Subtitles
    </h3>
    <div class="grid gap-8 px-10 py-7 md:grid-cols-2">
      <div class="grid grid-cols-4 justify-center text-gray-color">
        <label class="mr-2 mt-2 text-15px">Subtitles Mode</label>
        <div class="col-span-3 flex flex-col">
          <select name="subtitleType" class="w-full rounded-lg border px-4 py-2 outline-none">
            <option value="none">none</option>
            <option value="copy">copy</option>
            <option value="soft">soft</option>
            <option value="hard">hard</option>
          </select>
          <span class="mt-2 text-xs text-light-gray">Add hardsubs or softsubs to the video. "copy" copies the softsubs from the input file.</span>
        </div>
      </div>
      <div class="grid grid-cols-4 justify-center text-gray-color">
        <label for="" class="mr-2 mt-2 text-15px">Subtitles</label>
        <div class="col-span-3 flex flex-col">
          <div class="relative h-[42px] w-full cursor-pointer rounded-lg border border-[#dadadaff] text-center">
            <input @change="checkingFileType" name="subtitleFile" accept=".srt, .ass" type="file" class="absolute bottom-0 left-0 right-0 top-0 cursor-pointer border bg-[#ccc] text-[#777] opacity-0" />
            <span class="pointer-events-none absolute left-0 w-60 overflow-hidden text-ellipsis whitespace-nowrap rounded-r rounded-bl-none rounded-tl-none px-4 py-2 text-start">{{ updateFileName }}</span>
            <label class="pointer-events-none absolute right-0 w-32 rounded-r-lg border-l border-[#dadadaff] bg-[#f2f2f2ff] px-4 py-2">Browse</label>
          </div>
          <span class="mt-2 inline-flex text-xs text-light-gray">Add subtitles by selecting a SRT or ASS file. Only has an effect, if "Subtitles Mode" is set to "soft" or "hard".</span>
          <p v-if="wrongFormat" class="mt-5 text-sm text-red-600">Wrong file format. Please '.srt' or '.ass' files for the Subtitles.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const updateFileName = ref('Choosen a file...');
const wrongFormat = ref(false);
const checkingFileType = (event) => {
  if (event.target.files && event.target.files.length > 0) {
    // changing name
    const nameValue = event.target.files[0];
    // console.log(nameValue);
    updateFileName.value = nameValue.name;

    const validExtensions = ['.srt', '.ass'];
    // Getting if the file has a valid extension
    const fileExtension = nameValue.name.slice(((nameValue.name.lastIndexOf('.') - 1) >>> 0) + 2);

    // checking extension
    if (!validExtensions.includes('.' + fileExtension)) {
      wrongFormat.value = true;
    } else {
      wrongFormat.value = false;
    }
  } else {
    updateFileName.value = 'No file chosen';
  }
};
</script>
