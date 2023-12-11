<template>
  <div>
    <!-- Audio -->
    <h3 class="flex items-center justify-start bg-[#f1f1f1f1] px-10 py-3 text-lg font-bold text-gray-color">
      <img src="../../assets/images/sound.png" alt="" class="mr-[14px] h-5 w-5" />
      Audio
    </h3>
    <!-- Audio options -->
    <div class="grid gap-x-8 gap-y-6 px-10 py-7 coxl:grid-cols-2">
      <div v-for="(audio, index) in audioFields" :key="index" class="grid grid-cols-4 justify-center text-gray-color">
        <label :for="audio.name" class="mr-2 mt-2 text-15px">{{ audio.label }}</label>
        <div class="col-span-3 flex flex-col">
          <select :name="audio.name" class="w-full rounded-lg border px-4 py-2 outline-none bg-white">
            <option v-for="(option, optionIndex) in audio.options" :key="optionIndex" :value="option.value" :selected="option.selected">{{ option.label }}</option>
          </select>
          <span class="mt-2 text-xs text-light-gray">{{ audio.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue';
import { useGlobalStore } from '../../../src/Store/GlobalStore.js';

const GlobalData = useGlobalStore();

// Channels
const ChannelsSelectOptions = ref([
  { value: '', label: 'no change', selected: 'no change' },
  { value: '1', label: 'mono' },
  { value: '2', label: 'stereo' },
]);
// Volume
const VolumeSelectOptions = ref([
  { value: '7.4', label: '+640%' },
  { value: '5.7', label: '+470%' },
  { value: '5', label: '+400%' },
  { value: '4.5', label: '+350%' },
  { value: '4', label: '+300%' },
  { value: '3.6', label: '+260%' },
  { value: '3.2', label: '+220%' },
  { value: '2.8', label: '+180%' },
  { value: '2.5', label: '+150%' },
  { value: '2.25', label: '+125%' },
  { value: '2', label: '+100%' },
  { value: '1.8', label: '+80%' },
  { value: '1.6', label: '+60%' },
  { value: '1.4', label: '+40%' },
  { value: '1.25', label: '+25%' },
  { value: '1.1', label: '+10%' },
  { value: '', label: 'no change', selected: 'no change' },
  { value: '0.9', label: '-10%' },
  { value: '0.8', label: '-20%' },
  { value: '0.7', label: '-30%' },
  { value: '0.62', label: '-38%' },
  { value: '0.55', label: '-45%' },
  { value: '0.5', label: '-50%' },
]);
// SampleRate
const SampleRateSelectOptions = ref([
  { value: '', label: 'no change', selected: 'no change' },
  { value: '8000', label: '8000 Hz' },
  { value: '11025', label: '11025 Hz' },
  { value: '16000', label: '16000 Hz' },
  { value: '22050', label: '22050 Hz' },
  { value: '32000', label: '32000 Hz' },
  { value: '44100', label: '44100 Hz' },
  { value: '48000', label: '48000 Hz' },
  { value: '88200', label: '88200 Hz' },
  { value: '96000', label: '96000 Hz' },
]);
const BitrateValues = ref([
  { value: '', label: 'none' },
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
  { value: '61', label: '61' },
  { value: '62', label: '62' },
  { value: '63', label: '63' },
  { value: '64', label: '64' },
  { value: '65', label: '65' },
  { value: '66', label: '66' },
  { value: '67', label: '67' },
  { value: '68', label: '68' },
  { value: '69', label: '69' },
  { value: '70', label: '70' },
  { value: '71', label: '71' },
  { value: '72', label: '72' },
  { value: '73', label: '73' },
  { value: '74', label: '74' },
  { value: '75', label: '75' },
  { value: '76', label: '76' },
  { value: '77', label: '77' },
  { value: '78', label: '78' },
  { value: '79', label: '79' },
  { value: '80', label: '80' },
  { value: '96', label: '96' },
  { value: '112', label: '112' },
  { value: '128', label: '128', selected: '128' },
]);

// ----------------- AudioCodecOptions --------------------

// Default
const AudioCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac', selected: 'acc' },
  // { value: 'libfdk_aac', label: 'aac_he_1' },
  // { value: 'aac_at', label: 'aac_he_2' },
  { value: 'libopus', label: 'opus' },
  { value: 'wmav2', label: 'wmav2' },
  { value: 'libvorbis', label: 'vorbis' },
]);

//AudioCodecs for AVI & MOV
const AVIMOVCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac', selected: 'acc' },
  { value: 'libvorbis', label: 'vorbis' },
]);

//AudioCodecs for FLV
const FLVCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac', selected: 'acc' },
]);

//AudioCodecs for MKV & MP4
const MKVMP4CodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac', selected: 'acc' },
  { value: 'libopus', label: 'opus' },
  { value: 'libvorbis', label: 'vorbis' },
]);

//Audio Codecs for webm
const WEBMCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'libopus', label: 'opus', selected: 'opus' },
  { value: 'libvorbis', label: 'vorbis' },
]);

//Audio Codecs for wmv
const WMVCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'wmav2', label: 'wmav2', selected: 'wmav2' },
]);

//Audio Codecs for 3g2
const threeG2CodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac', selected: 'acc' },
]);

//Audio Codecs for 3gp | m4v
const m4v3gpCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac', selected: 'acc' },
]);

//Audio Codecs for cavs
const cavsCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
]);

//Audio Codecs for 3gp
const otherCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac' },
  { value: 'pcm_s16le', label: 'PCM S16LE', selected: 'pcm_s16le' },
]);

//Audio Codecs for m2ts
const m2tsCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac' },
  { value: 'libopus', label: 'opus', selected: 'opus' },
  { value: 'libvorbis', label: 'vorbis' },
]);

//Audio Codecs for mpg
const mpgCodecOptions = ref([
  { value: 'copy', label: 'copy', selected: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'libmp3lame', label: 'mp3' },
]);

//Audio Codecs for mts
const mtsCodecOptions = ref([
  { value: 'copy', label: 'copy', selected: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac' },
  { value: 'libopus', label: 'opus' },
  { value: 'libvorbis', label: 'vorbis' },
]);

//Audio Codecs for mxf
const mxfCodecOptions = ref([
  { value: 'copy', label: 'copy', selected: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'pcm_s16le', label: 'PCM S16LE' },
]);

//Audio Codecs for ogg
const oggCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac', selected: 'acc' },
  { value: 'libopus', label: 'opus' },
  { value: 'libvorbis', label: 'vorbis' },
]);

//Audio Codecs for mpeg
const mpegCodecOptions = ref([
  { value: 'copy', label: 'copy', selected: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'libmp3lame', label: 'mp3' },
  { value: 'pcm_s16be', label: 'pcm s16be' },
]);

//Audio Codecs for rm
const rmCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac', selected: 'acc' },
]);

//Video COdec for rmvb
const rmvbCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac', selected: 'acc' },
  { value: 'libopus', label: 'opus' },
  { value: 'wmav2', label: 'wmav2' },
  { value: 'libvorbis', label: 'vorbis' },
]);

//Audio Codecs for swf | MOD | ts | wtv
const multipleVideoCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: 'none', label: 'none' },
  { value: 'aac', label: 'aac', selected: 'acc' },
  { value: 'libopus', label: 'opus' },
  { value: 'libvorbis', label: 'vorbis' },
]);

//Selecting value for video-codec
const selectedAudioCodecOptions = computed(() => {
  const selectedFormat = GlobalData.selectedFormat;

  switch (selectedFormat) {
    case '.webm':
      return WEBMCodecOptions.value;
    case '.wmv':
      return WMVCodecOptions.value;
    case '.avi':
    case '.mov':
      return AVIMOVCodecOptions.value;
    case '.flv':
      return FLVCodecOptions.value;
    case '.mp4':
    case '.mkv':
      return MKVMP4CodecOptions.value;
    case '.3g2':
      return threeG2CodecOptions.value;
    case '.3gp':
    case '.m4v':
      return m4v3gpCodecOptions.value;
    case '.cavs':
      return cavsCodecOptions.value;
    case '.dv':
      return otherCodecOptions.value;
    case '.m2ts':
      return m2tsCodecOptions.value;
    case '.mpg':
      return mpgCodecOptions.value;
    case '.mpeg':
      return mpegCodecOptions.value;
    case '.mts':
      return mtsCodecOptions.value;
    case '.mxf':
      return mxfCodecOptions.value;
    case '.ogg':
      return oggCodecOptions.value;
    case '.rm':
      return rmCodecOptions.value;
    case '.rmvb':
      return rmvbCodecOptions.value;
    case '.swf':
    case '.MOD':
    case '.ts':
    case '.wtv':
      return multipleVideoCodecOptions.value;
    default:
      return AudioCodecOptions.value;
  }
});

watch(
  () => GlobalData.selectedFormat,
  () => {
    const updatedValue = selectedAudioCodecOptions;
    // console.log(updatedValue);
  }
);

// Audio
const audioFields = reactive([
  {
    name: 'AudioCodec',
    label: 'Audio Codec',
    options: selectedAudioCodecOptions.value,
    description: 'Codec to encode the audio. Use "copy" to copy the stream without re-encoding.',
  },
  {
    name: 'ChannelsSelect',
    label: 'Channels',
    options: ChannelsSelectOptions.value,
    description: 'Convert the audio to mono/stereo.',
  },
  {
    name: 'VolumeSelect',
    label: 'Volume',
    options: VolumeSelectOptions.value,
    description: 'Make audio louder or quiter.',
  },
  {
    name: 'SampleRateSelect',
    label: 'Sample Rate',
    options: SampleRateSelectOptions.value,
    description: 'Set the audio sampling frequency, for example 48000 Hz or 44100 Hz.',
  },
  {
    name: 'BitrateValuesSelect',
    label: 'Audio Bitrate',
    options: BitrateValues.value,
    description: 'Audio bitrate.',
  },
]);

watch(
  () => selectedAudioCodecOptions.value,
  (newOptions) => {
    audioFields[0].options = newOptions;
  }
);
</script>
