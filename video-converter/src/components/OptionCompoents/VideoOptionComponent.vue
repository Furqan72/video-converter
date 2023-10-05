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
    <h3 class="flex items-center justify-start bg-[#f1f1f1f1] px-10 py-3 text-lg font-bold text-gray-color">
      <img src="../../assets/images/video-camera.png" alt="" class="mr-[14px] h-5 w-5" />
      Video
    </h3>
    <div class="grid gap-x-8 gap-y-6 px-10 py-7 coxl:grid-cols-2">
      <template v-for="(field, index) in fields" :key="index">
        <div v-if="!shouldHideField(field)" class="grid grid-cols-4 justify-center text-gray-color">
          <label :for="field.name" class="mr-2 mt-2 text-15px">{{ field.label }}</label>
          <div class="col-span-3 flex flex-col">
            <select :name="field.name" class="w-full rounded-lg border px-4 py-2 outline-none">
              <option v-for="(option, optionIndex) in field.options" :key="optionIndex" :value="option.value" :selected="option.selected">{{ option.label }}</option>
            </select>
            <span class="mt-2 text-xs text-light-gray">{{ field.description }}</span>
          </div>
        </div>
      </template>
      <div class="grid grid-cols-4 justify-center text-gray-color" :class="GlobalData.selectedFormat === '.wmv' ? 'block' : 'hidden'">
        <label for="" class="mr-2 mt-2 text-15px">Qscale</label>
        <div class="col-span-3 flex flex-col">
          <input type="text" name="Qscale" class="w-full rounded-lg border px-4 py-2 outline-none" value="5" placeholder="" />
          <span class="mt-2 text-xs text-light-gray">Video quality ranging from 1-31, with 1 being highest quality/largest filesize and 31 being the lowest quality/smallest filesize.</span>
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

// Resolution
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
]);
// Aspect ratio
const aspectRatioOptions = ref([
  { value: 'no change', label: 'no change', selected: 'no changes' },
  { value: '16/9', label: '16:9' },
  { value: '14/9', label: '14:9' },
  { value: '4/3', label: '4:3' },
]);
// Constant quality
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
// Preset
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
// Tune
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
// Profile
const ProfileOptions = ref([
  { value: 'none', label: 'none', selected: 'none' },
  { value: 'baseline', label: 'baseline' },
  { value: 'main', label: 'main' },
  { value: 'high', label: 'high' },
  { value: 'high10', label: 'high10' },
  { value: 'high422', label: 'high422' },
  { value: 'high444', label: 'high444' },
]);
// Level
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
// Fit
const FitOptions = ref([
  { value: 'max', label: 'max' },
  { value: 'crop', label: 'crop' },
  { value: 'scale', label: 'scale', selected: 'scale' },
  { value: 'pad', label: 'pad' },
]);
// FPS
const FPSvalue = ref([
  { value: '', label: 'none', selected: '' },
  { value: '0', label: '0' },
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
  { value: '18', label: '18' },
  { value: '19', label: '19' },
  { value: '20', label: '20' },
  { value: '21', label: '21' },
  { value: '22', label: '22' },
  { value: '23', label: '23' },
  { value: '24', label: '24' },
  { value: '25', label: '25' },
  { value: '26', label: '26' },
  { value: '27', label: '27' },
  { value: '28', label: '28' },
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
  { value: '51', label: '51' },
  { value: '52', label: '52' },
  { value: '53', label: '53' },
  { value: '54', label: '54' },
  { value: '55', label: '55' },
  { value: '56', label: '56' },
  { value: '57', label: '57' },
  { value: '58', label: '58' },
  { value: '59', label: '59' },
  { value: '60', label: '60' },
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
  { value: 'flv', label: 'sorenson' }, // check it for the value to complete validation
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
//  video COdec for mp4
const mp4CodecOptions = ref([
  { value: 'copy', label: 'Copy (No Re-encoding)' },
  { value: 'libx264', label: 'x264', selected: 'x264' },
  { value: 'libx265', label: 'x265' },
  { value: 'libaom-av1', label: 'av1' },
]);
//  video COdec for mov
const movCodecOptions = ref([
  { value: 'copy', label: 'Copy (No Re-encoding)' },
  { value: 'libx264', label: 'x264', selected: 'x264' },
  { value: 'libx265', label: 'x265' },
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
//  video COdec for 3g2
const threeG2CodecOptions = ref([
  { value: 'copy', label: 'Copy (No Re-encoding)' },
  { value: 'libx264', label: 'x264', selected: 'x264' },
  // { value: 'libxvid', label: 'xvid' },
]);
//  video COdec for 3gp
const threeGPCodecOptions = ref([
  { value: 'copy', label: 'Copy (No Re-encoding)' },
  { value: 'libx264', label: 'x264', selected: 'x264' },
  { value: 'libxvid', label: 'xvid' },
]);
//  video COdec for cavs
const cavsCodecOptions = ref([{ value: 'copy', label: 'Copy' }]);
//  video COdec for dv
const dvCodecOptions = ref([
  { value: 'copy', label: 'Copy (No Re-encoding)' },
  { value: 'dvvideo', label: 'dvvideo', selected: 'dvvideo' },
]);
//  video COdec for m2ts
const m2tsCodecOptions = ref([
  { value: 'copy', label: 'Copy', selected: 'Copy' },
  { value: 'libx264', label: 'x264' },
  { value: 'libx265', label: 'x265' },
]);
//  video COdec for m4v
const m4vCodecOptions = ref([
  { value: 'copy', label: 'Copy', selected: 'Copy' },
  { value: 'libx264', label: 'x264' },
]);
// //  video COdec for mpg
const mpgCodecOptions = ref([
  { value: 'copy', label: 'Copy', selected: 'Copy' },
  { value: 'libx264', label: 'x264' },
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
      return movCodecOptions.value;
    case 'webm':
      return webmCodecOptions.value;
    case 'wmv':
      return wmvCodecOptions.value;
    case '3g2':
      return threeG2CodecOptions.value;
    case '3gp':
      return threeGPCodecOptions.value;
    case 'dv':
      return dvCodecOptions.value;
    case 'cavs':
      return cavsCodecOptions.value;
    case 'm2ts':
      return m2tsCodecOptions.value;
    case 'm4v':
      return m4vCodecOptions.value;
    case 'mpg':
      return mpgCodecOptions.value;
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
  {
    name: 'fpsSelect',
    label: 'FPS',
    options: FPSvalue.value,
    description: 'Change the video frame rate.',
  },
]);

const videoOptionsToHide = ['presetSelect', 'tuneSelect', 'profileSelect', 'levelSelect'];
const videoOptionsToHidefor = ['.wmv', '.3g2', '.3gp', '.dv', '.cavs', '.m2ts', '.m4v', '.mpg'];

// to hide certain option for certain video codecs
const shouldHideField = computed(() => (field) => {
  const selectedFormat = GlobalData.selectedFormat;

  if (videoOptionsToHidefor.includes(selectedFormat)) {
    return videoOptionsToHide.includes(field.name) || field.name === 'ConstantQualitySelect';
  }

  if (selectedFormat === '.webm') {
    return videoOptionsToHide.includes(field.name);
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
