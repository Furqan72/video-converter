<template>
  <article class="bg-[#f9f9f9] px-28 py-10">
    <div class="bg-white px-10 py-10" v-if="formatDescription[0] !== ''">
      <h3 class="flex items-center justify-start py-3 text-lg font-bold text-gray-color">
        <img src="../assets/images/file.png" alt="" class="mr-[14px] h-5 w-5" />
        <span class="uppercase">{{ formatDescription[0] }}</span>
      </h3>
      <p>{{ formatDescription[1] }}</p>
    </div>
  </article>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// global store
import { useGlobalStore } from '../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

const formatIntroduction = ref([
  { label: '3g2', description: 'The 3g2 format is a multimedia container format that is commonly used for mobile video playback. It offers good video quality and is compatible with a wide range of devices.' },
  { label: '3gp', description: '3gp files are multimedia files that are primarily associated with mobile phones for video playback. They are space-efficient and provide decent video compression.' },
  { label: '3gpp', description: '3gpp is a multimedia container format used for storing audio and video streams on 3G mobile phones. It is widely supported and ensures smooth playback on mobile devices.' },
  { label: 'avi', description: 'AVI is a popular video format known for its high-quality video and audio capabilities. It is commonly used for storing movies and supports a wide range of codecs.' },
  { label: 'cavs', description: 'CAVS is a lesser-known video format used for multimedia applications. It provides good compression and is suitable for various audio and video content.' },
  { label: 'dv', description: 'DV is a digital video format used for professional video production. It offers exceptional video quality and is a standard format for camcorders.' },
  { label: 'dvr', description: 'DVR format is used for recording and storing television broadcasts. It allows users to pause, rewind, and schedule recordings of their favorite shows.' },
  { label: 'flv', description: 'FLV is a popular format for web-based video content. It is known for its small file size and is widely supported by web browsers and video players.' },
  { label: 'm2ts', description: 'M2TS is a format commonly used for high-definition video storage on Blu-ray discs. It offers excellent video quality and supports advanced features like multiple audio tracks.' },
  { label: 'm4v', description: 'M4V is a video format developed by Apple. It is similar to MP4 and is commonly used for iTunes video content, providing good quality and compatibility with Apple devices.' },
  { label: 'mkv', description: 'MKV is a versatile video format known for its support of multiple audio and video tracks. It is often used for high-definition video content and offers great flexibility.' },
  { label: 'MOD', description: 'MOD is a format used by digital camcorders. It provides good video quality and is known for its ease of editing and playback.' },
  { label: 'mov', description: 'MOV is an Apple QuickTime format suitable for high-quality video playback. It is widely supported and is used for various multimedia applications.' },
  { label: 'mp4', description: 'MP4 is a widely supported format used for streaming and storing video content. It offers excellent compression and compatibility with a wide range of devices.' },
  { label: 'mpeg', description: 'MPEG is a standard for video and audio compression. It is widely used for DVD video and offers good video quality and compression efficiency.' },
  { label: 'mpg', description: 'MPG is a format commonly used for video storage. It provides good quality and is suitable for various applications, including DVD video.' },
  { label: 'mts', description: 'MTS is a format used for high-definition video recording. It offers excellent video quality and is commonly used in camcorders and professional video production.' },
  { label: 'mxf', description: 'MXF is a container format used in professional video production. It supports high-quality video and audio streams and is widely used in the industry.' },
  { label: 'ogg', description: 'OGG is an open-source multimedia format known for its high-quality audio. It is commonly used for music and audio content.' },
  { label: 'rm', description: 'RM is a format developed by RealNetworks for streaming video content. It provides good streaming quality and is used for online video playback.' },
  { label: 'rmvb', description: 'RMVB is a variation of RM format optimized for video compression. It offers good quality and is commonly used for online streaming.' },
  { label: 'swf', description: 'SWF is a format used for Adobe Flash animations. It is known for its vector graphics and multimedia capabilities, often used for web content.' },
  { label: 'ts', description: 'TS is a format used for broadcasting and recording television. It offers good video quality and is commonly used for digital TV.' },
  { label: 'vob', description: 'VOB is a format used for DVD video content. It provides excellent video quality and is a standard format for DVD video storage.' },
  { label: 'webm', description: 'WebM is an open and royalty-free format designed for web video. It provides high-quality video and is widely supported for web-based content.' },
  { label: 'wmv', description: 'WMV is a format developed by Microsoft for video playback. It offers good compression and compatibility with Windows-based devices.' },
  { label: 'wtv', description: 'WTV is a format used for Windows Media Center recordings. It allows users to schedule and manage TV recordings on Windows-based systems.' },
]);

const formatDescription = ref(['', '']);

watch(
  () => GlobalData.selectedFileFormat,
  (newSelectedFormat) => {
    const formatInfo = formatIntroduction.value.find((format) => format.label === newSelectedFormat.substring(1));
    formatDescription.value = [formatInfo.label, formatInfo.description];
    // console.log('Updated description:', formatDescription.value);
  }
);
</script>
