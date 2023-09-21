<template>
  <div>
    <!-- video -->
    <h3 class="flex items-center justify-start bg-[#f1f1f1f1] px-10 py-3 text-lg font-semibold text-gray-color">
      <img src="../assets/images/video-camera.png" alt="" class="mr-5 h-5 w-5" />
      Video
    </h3>
    <!-- Video options -->
    <div class="grid gap-x-8 gap-y-6 px-10 py-7 coxl:grid-cols-2">
      <div v-for="(field, index) in fields" :key="index" class="grid grid-cols-4 justify-center text-gray-color">
        <template v-if="!shouldHideField(field)">
          <label :for="field.name" class="mr-2 mt-2 text-15px">{{ field.label }}</label>
          <div class="col-span-3 flex flex-col">
            <select :name="field.name" class="w-full rounded-lg border px-4 py-2 outline-none">
              <option v-for="(option, optionIndex) in field.options" :key="optionIndex" :value="option.value" :selected="option.selected">{{ option.label }}</option>
            </select>
            <span class="mt-2 text-xs text-light-gray">{{ field.description }}</span>
          </div>
        </template>
      </div>
      <div class="grid grid-cols-4 justify-center text-gray-color" :class="GlobalData.selectedFormat === '.wmv' ? 'block' : 'hidden'">
        <label for="" class="mr-2 mt-2 text-15px">Qscale</label>
        <div class="col-span-3 flex flex-col">
          <input type="text" name="Qscale" class="w-full rounded-lg border px-4 py-2 outline-none" value="5" placeholder="" />
          <span class="mt-2 text-xs text-light-gray">Video quality ranging from 1-31, with 1 being highest quality/largest filesize and 31 being the lowest quality/smallest filesize.</span>
        </div>
      </div>
      <div class="grid grid-cols-4 justify-center text-gray-color">
        <label for="" class="mr-2 mt-2 text-15px">Fps</label>
        <div class="col-span-3 flex flex-col">
          <input type="text" name="Fps" class="w-full rounded-lg border px-4 py-2 outline-none" placeholder="" />
          <span class="mt-2 text-xs text-light-gray">Change the video frame rate.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { ref, computed } from 'vue';
import { ref, computed, watch, reactive } from 'vue';
// global store
import { useGlobalStore } from '../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

// resolution
const resolutionOptions = ref([
  { value: 'no change', label: 'no change', selected: 'no changes' },
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
  { value: 'no change', label: 'no change', selected: 'no changes' },
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
  { value: '23', label: '23 (normal quality)', selected: '23 (normal quality)' },
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

// preset
const PresetOptions = ref([
  { value: 'ultrafast', label: 'ultrafast' },
  { value: 'superfast', label: 'superfast' },
  { value: 'veryfast', label: 'veryfast' },
  { value: 'faster', label: 'faster' },
  { value: 'fast', label: 'fast' },
  { value: 'medium', label: 'medium', selected: 'medium' },
  { value: 'slow', label: 'slow' },
  { value: 'slower', label: 'slower' },
  { value: 'veryslow', label: 'veryslow' },
]);
// tune
const TuneOptions = ref([
  { value: 'none', label: 'none', selected: 'none' },
  { value: 'film', label: 'film' },
  { value: 'animation', label: 'animation' },
  { value: 'grain', label: 'grain' },
  { value: 'stillimage', label: 'stillimage' },
  { value: 'fastdecode', label: 'fastdecode' },
  { value: 'zerolatency', label: 'zerolatency' },
  { value: 'psnr', label: 'psnr' },
  { value: 'ssim', label: 'ssim' },
]);
// profile
const ProfileOptions = ref([
  { value: 'none', label: 'none', selected: 'none' },
  { value: 'baseline', label: 'baseline' },
  { value: 'main', label: 'main' },
  { value: 'high', label: 'high' },
  { value: 'high10', label: 'high10' },
  { value: 'high422', label: 'high422' },
  { value: 'high444', label: 'high444' },
]);
// level
const LevelOptions = ref([
  { value: 'none', label: 'none', selected: 'none' },
  { value: '1', label: '1' },
  { value: '1b', label: '1b' },
  { value: '1.1', label: '1.1' },
  { value: '1.2', label: '1.2' },
  { value: '1.3', label: '1.3' },
  { value: '2.0', label: '2.0' },
  { value: '2.1', label: '2.1' },
  { value: '2.2', label: '2.2' },
  { value: '3.0', label: '3.0' },
  { value: '3.1', label: '3.1' },
  { value: '3.2', label: '3.2' },
  { value: '4.0', label: '4.0' },
  { value: '4.1', label: '4.1' },
  { value: '4.2', label: '4.2' },
  { value: '5.0', label: '5.0' },
  { value: '5.1', label: '5.1' },
  { value: '5.2', label: '5.2' },
]);
// fit
const FitOptions = ref([
  { value: 'max', label: 'max' },
  { value: 'crop', label: 'crop' },
  { value: 'scale', label: 'scale', selected: 'scale' },
  { value: 'pad', label: 'pad' },
]);

// -------------- Video Codecs for all formats-----------------------

//  video COdec for avi
const aviCodecOptions = ref([
  { value: 'copy', label: 'Copy (No Re-encoding)' },
  { value: 'libx264', label: 'x264', selected: 'x264' },
  { value: 'libx265', label: 'x265' },
  { value: 'libxvid', label: 'xvid' },
]);
//  video COdec for flv
const flvCodecOptions = ref([
  { value: 'copy', label: 'Copy (No Re-encoding)' },
  { value: 'libx264', label: 'x264', selected: 'x264' },
  { value: 'flv', label: 'sorenson' },
]);
//  video COdec for mkv
const mkvCodecOptions = ref([
  { value: 'copy', label: 'Copy (No Re-encoding)' },
  { value: 'libx264', label: 'x264', selected: 'x264' },
  { value: 'libx265', label: 'x265' },
  { value: 'libvpx', label: 'vp8' },
  { value: 'libvpx-vp9', label: 'vp9' },
  { value: 'libaom-av1', label: 'av1' },
]);
//  video COdec for mp4 mov
const mp4CodecOptions = ref([
  { value: 'copy', label: 'Copy (No Re-encoding)' },
  { value: 'libx264', label: 'x264', selected: 'x264' },
  { value: 'libx265', label: 'x265' },
  { value: 'libaom-av1', label: 'av1' },
]);
//  video COdec for webm
const webmCodecOptions = ref([
  { value: 'copy', label: 'Copy (No Re-encoding)' },
  { value: 'libvpx', label: 'vp8', selected: 'vp8' },
  { value: 'libvpx-vp9', label: 'vp9' },
  { value: 'libaom-av1', label: 'av1' },
]);
//  video COdec for wmv
const wmvCodecOptions = ref([
  { value: 'copy', label: 'Copy (No Re-encoding)' },
  { value: 'msmpeg4v2', label: 'msmpeg4', selected: 'msmpeg4' },
  { value: 'wmv2', label: 'wmv2' },
]);

// removing (.) from selected value
const formatWithoutDot = computed(() => {
  const selectedFormat = GlobalData.selectedFormat;
  if (selectedFormat.startsWith('.')) {
    return selectedFormat.slice(1);
  }
  return selectedFormat;
});

// selecting value for video-codec
const selectedVideoCodecOptions = computed(() => {
  const selectedFormat = formatWithoutDot.value;
  switch (selectedFormat) {
    case 'avi':
      return aviCodecOptions.value;
    case 'flv':
      return flvCodecOptions.value;
    case 'mkv':
      return mkvCodecOptions.value;
    case 'mp4':
      return mp4CodecOptions.value;
    case 'mov':
      return mp4CodecOptions.value;
    case 'webm':
      return webmCodecOptions.value;
    case 'wmv':
      return wmvCodecOptions.value;
    default:
      return [];
  }
});

watch(
  () => GlobalData.selectedFormat,
  () => {
    const formattedValue = formatWithoutDot.value;
    // console.log(formattedValue);
    // console.log(updatedValue.value);
  }
);
watch(
  () => formatWithoutDot.value,
  () => {
    const updatedValue = selectedVideoCodecOptions;
  }
);

// for video-options
const fields = reactive([
  {
    name: 'ResolutionMenu',
    label: 'Resolution',
    options: resolutionOptions.value,
    description: 'By default we keep the current resolution.',
  },
  {
    name: 'AspectRatioSelect',
    label: 'Aspect Ratio',
    options: aspectRatioOptions.value,
    description: 'Change the video aspect ratio, for example to 16:9 or 4:3.',
  },
  {
    name: 'ConstantQualitySelect',
    label: 'Constant Quality (CRF)',
    options: constantQualityOptions.value,
    description: 'The CRF value sets the video quality and can be from 0–63. Lower values mean better quality but longer conversion times. Recommended values range from 15–35.',
  },
  {
    name: 'videotCodecSelect',
    label: 'Video Codec',
    options: selectedVideoCodecOptions.value,
    description: 'Codec to encode the video. Use "copy" to copy the stream without re-encoding.',
  },
  {
    name: 'presetSelect',
    label: 'Preset',
    options: PresetOptions.value,
    description: 'The preset is a collection of options that will provide a certain encoding speed to compression ratio.',
  },
  {
    name: 'tuneSelect',
    label: 'Tune',
    options: TuneOptions.value,
    description: 'Settings based upon the specifics of your input.',
  },
  {
    name: 'profileSelect',
    label: 'Profile',
    options: ProfileOptions.value,
    description: 'Set output to a specific H264 compatibility profile.',
  },
  {
    name: 'levelSelect',
    label: 'Level',
    options: LevelOptions.value,
    description: 'Set output to a specific H264 compatibility profile level.',
  },
  {
    name: 'fitSelect',
    label: 'Fit',
    options: FitOptions.value,
    description: 'Sets the mode of sizing the video. "Max" resizes the video to fit within the width and height, but will not increase the size of the image if it is smaller than width or height. "Crop" resizes the video to fill the width and height dimensions and crops any excess video data. "Scale" enforces the video width and height by scaling. "Pad" resizes the video to the width and height dimensions and keeps the aspect ratio by adding black bars if necessary.',
  },
]);

// const filteredList = fields
//   .filter((e) => e. === '1')
//   .map((e) => {
//     return { name: e., unit: e.properties.unit };
//   });
// console.log(filteredList);

// const shouldHideField = computed(() => {
//   const selectedFormat = GlobalData.selectedFormat;
//   return (field) => {
//     if (selectedFormat === '.webm') {
//       if (
//         field.name === 'ResolutionMenu' ||
//         field.name === 'AspectRatioSelect'
//       ) {
//         return true;
//       }
//     }
//     return false;
//   };
// });

const shouldHideField = computed(() => (field) => {
  const selectedFormat = GlobalData.selectedFormat;
  if (selectedFormat === '.webm') {
    if (field.name === 'presetSelect' || field.name === 'tuneSelect' || field.name === 'profileSelect' || field.name === 'levelSelect') {
      return true;
    }
  }
  if (selectedFormat === '.wmv') {
    if (field.name === 'ConstantQualitySelect' || field.name === 'presetSelect' || field.name === 'tuneSelect' || field.name === 'profileSelect' || field.name === 'levelSelect') {
      return true;
    }
  }
  return false;
});

watch(
  () => selectedVideoCodecOptions.value,
  (newOptions) => {
    // Updateing videotCodec options
    fields[3].options = newOptions;
  }
);
</script>
