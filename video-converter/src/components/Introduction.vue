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
  // Images
  { label: '3fr', description: '3FR is a digital camera raw image format used by Hasselblad. It provides high-quality image data.' },
  { label: 'ARW', description: 'ARW is a digital camera raw image format used by Sony. It offers flexibility for post-processing.' },
  { label: 'avif', description: 'AVIF is an image format designed for superior compression efficiency. It is great for web use.' },
  { label: 'bmp', description: `BMP is a standard Windows bitmap image format. It's widely supported for simple graphics.` },
  { label: 'CR2', description: 'CR2 is a digital camera raw image format used by Canon. It retains high-quality image data.' },
  { label: 'cr3', description: 'CR3 is a digital camera raw image format used by Canon. It supports advanced features.' },
  { label: 'crw', description: 'CRW is a digital camera raw image format used by Canon. It captures image details.' },
  { label: 'dcr', description: 'DCR is a digital camera raw image format used by Kodak. It preserves image information.' },
  { label: 'dng', description: 'DNG is an open standard for digital camera raw files. It offers compatibility and flexibility.' },
  { label: 'eps', description: `EPS is a popular vector graphics file format often used in printing. It's ideal for logos and illustrations.` },
  { label: 'erf', description: `ERF is a digital camera raw image format used by Epson. It captures color and detail.` },
  { label: 'gif', description: `GIF is a widely used image format with support for animations. It's great for simple web graphics.` },
  { label: 'heic', description: `HEIC is a modern image format used on Apple devices. It offers high-quality compression.` },
  { label: 'heif', description: `HEIF is a versatile image format supporting high-quality images. It's efficient for storage.` },
  { label: 'icns', description: `ICNS is an icon format used on macOS systems. It's used for application icons.` },
  { label: 'ico', description: 'ICO is a common icon file format for Windows. It represents application icons.' },
  { label: 'jfif', description: `JFIF is a simple JPEG interchange format. It's a standard for JPEG images.` },
  { label: 'jpeg', description: `JPEG is a popular image format known for its compression. It's used for photos and images.` },
  { label: 'jpg', description: `JPG is another name for JPEG image files. It's widely supported for images.` },
  { label: 'mos', description: 'MOS is a digital camera raw image format used by Leaf. It captures image data.' },
  { label: 'mrw', description: `MRW is a digital camera raw image format used by Minolta. It's known for color accuracy.` },
  { label: 'nef', description: 'NEF is a digital camera raw image format used by Nikon. It captures image details.' },
  { label: 'odd', description: 'ODD is a rare image format, please check compatibility. It may have unique features.' },
  { label: 'odg', description: `ODG is a graphic document format used in LibreOffice. It's an open format for documents.` },
  { label: 'orf', description: 'ORF is a digital camera raw image format used by Olympus. It captures color and detail.' },
  { label: 'pef', description: 'PEF is a digital camera raw image format used by Pentax. It preserves image information.' },
  { label: 'png', description: `PNG is a lossless image format with transparent support. It's ideal for web graphics and logos.` },
  { label: 'ppm', description: `PPM is a simple image format often used for processing. It's great for bitmap graphics.` },
  { label: 'ps', description: `PS is a document format used in Adobe PostScript. It's used for printing and graphics.` },
  { label: 'psd', description: `PSD is Adobe Photoshop\'s native image format. It's used for editing and graphics.` },
  { label: 'raf', description: 'RAF is a digital camera raw image format used by Fuji. It captures rich color.' },
  { label: 'raw', description: 'RAW is a generic term for unprocessed image data. It preserves image data.' },
  { label: 'rw2', description: 'RW2 is a digital camera raw image format used by Panasonic. It captures detail.' },
  { label: 'tif', description: `TIF is a versatile image format supporting high-quality images. It's used for archiving and printing.` },
  { label: 'tiff', description: `TIFF is a common format for storing images with high quality. It's used in graphics and printing.` },
  { label: 'webp', description: 'WEBP is a modern image format developed by Google. It offers high-quality and small file sizes.' },
  { label: 'x3f', description: `X3F is a digital camera raw image format used by Sigma. It's known for capturing detail.` },
  { label: 'xcf', description: `XCF is the native image format used by GIMP (GNU Image Manipulation Program). It's ideal for editing.` },
  { label: 'xps', description: `XPS is a fixed-layout document format developed by Microsoft. It's used for documents and printing.` },
]);

const formatDescription = ref(['', '']);

watch(
  () => GlobalData.selectedFileFormat,
  (newSelectedFormat) => {
    const formatInfo = formatIntroduction.value.find((format) => format.label == newSelectedFormat.substring(1));
    formatDescription.value = [formatInfo.label, formatInfo.description];
    // console.log('Updated description:', formatDescription.value);
  }
);
</script>
