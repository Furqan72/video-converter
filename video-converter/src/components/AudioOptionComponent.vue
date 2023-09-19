<template>
  <div>
    <!-- Audio -->
    <h3 class="flex items-center justify-start bg-[#f1f1f1f1] px-10 py-3 text-lg font-semibold text-gray-color">
      <img src="../assets/images/sound.png" alt="" class="mr-5 h-5 w-5" />
      Audio
    </h3>
    <!-- Audio options -->
    <div class="grid gap-x-8 gap-y-6 px-10 py-7 coxl:grid-cols-2">
      <div v-for="(audio, index) in audioFields" :key="index" class="grid grid-cols-4 justify-center text-gray-color">
        <label :for="audio.name" class="mr-2 mt-2 text-15px">{{ audio.label }}</label>
        <div class="col-span-3 flex flex-col">
          <select :name="audio.name" class="w-full rounded-lg border px-4 py-2 outline-none">
            <option v-for="(option, optionIndex) in audio.options" :key="optionIndex" :value="option.value" :selected="option.selected">{{ option.label }}</option>
          </select>
          <span class="mt-2 text-xs text-light-gray">{{ audio.description }}</span>
        </div>
      </div>
      <div class="grid grid-cols-4 justify-center text-gray-color">
        <label for="" class="mr-2 mt-2 text-15px">Audio Bitrate</label>
        <div class="col-span-3 flex flex-col">
          <input type="text" name="AudioBitrate" id="" class="w-full rounded-lg border px-4 py-2 outline-none" placeholder="" value="128" />
          <span class="mt-2 text-xs text-light-gray">Audio bitrate.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue';
import { useGlobalStore } from '../../src/Store/GlobalStore.js';
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

//AudioCodecs for except wmv & webm
const AudioCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: '', label: 'none' },
  { value: 'aac', label: 'aac', selected: 'acc' },
  { value: 'libfdk_aac', label: 'aac_he_1' },
  { value: 'libfdk_aac', label: 'aac_he_2' },
  { value: 'libopus', label: 'opus' },
  { value: 'libvorbis', label: 'vorbis' },
]);
//Audio Codecs for webm
const WEBMCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: '', label: 'none' },
  { value: 'libopus', label: 'opus', selected: 'opus' },
  { value: 'libvorbis', label: 'vorbis' },
]);
//Audio Codecs for wmv
const WMVCodecOptions = ref([
  { value: 'copy', label: 'copy' },
  { value: '', label: 'none' },
  { value: 'wmav2', label: 'wmav2', selected: 'wmav2' },
]);

// selecting value for video-codec
const selectedAudioCodecOptions = computed(() => {
  const selectedFormat = GlobalData.selectedFormat;
  if (selectedFormat === '.webm') {
    return WEBMCodecOptions.value;
  } else if (selectedFormat === '.wmv') {
    return WMVCodecOptions.value;
  } else {
    return AudioCodecOptions.value;
  }
});

watch(
  () => GlobalData.selectedFormat,
  () => {
    const updatedValue = selectedAudioCodecOptions;
    console.log(updatedValue);
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
    description: 'Set the audio sampling frequency, for example 48000 Hz or 44100 Hz',
  },
]);

watch(
  () => selectedAudioCodecOptions.value,
  (newOptions) => {
    audioFields[0].options = newOptions;
  }
);
</script>
