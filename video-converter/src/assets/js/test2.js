// const progressElement = ref('');
// const io = socketIo('http://localhost:4000/convert');
// // io.on('connect', () => {
//   console.log('Connected to server');
// });

// // io.on('progress', function (progressPercent) {
//   console.log('Received progress:', progressPercent);
//   progressElement.value = 'Conversion Progress: ' + progressPercent + '%';
// });

// // io.on('disconnect', () => {
//   console.log('Disconnected from server');
// });

// console.log(progressElement.value);

// applying water marks
// if (imageWatermark) {
//   command.input(watermarkPath).complexFilter(`[0:v][1:v]overlay=(W-w)/2:(H-h)/2`);
// }

//       FFmpeg command: ffmpeg -i ./temp-files/mov_bbb.mp4 -y -acodec aac -b:a 128k -vcodec libaom-av1 -crf 23 -preset medium ./temp-output/converted-mov_bbb.webm
// Error: Error: ffmpeg exited with code 1: Conversion failed!

//     at ChildProcess.<anonymous> (G:\video-converter\api\node_modules\fluent-ffmpeg\lib\processor.js:182:22)
//     at ChildProcess.emit (node:events:514:28)
//     at ChildProcess._handle.onexit (node:internal/child_process:291:12)
// FFmpeg stderr: ffmpeg version 6.0-essentials_build-www.gyan.dev Copyright (c) 2000-2023 the FFmpeg developers
//   built with gcc 12.2.0 (Rev10, Built by MSYS2 project)
//   configuration: --enable-gpl --enable-version3 --enable-static --disable-w32threads --disable-autodetect --enable-fontconfig --enable-iconv --enable-gnutls --enable-libxml2 --enable-gmp --enable-lzma --enable-zlib --enable-libsrt --enable-libssh --enable-libzmq --enable-avisynth --enable-sdl2 --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxvid --enable-libaom --enable-libopenjpeg --enable-libvpx --enable-libass --enable-libfreetype --enable-libfribidi --enable-libvidstab --enable-libvmaf --enable-libzimg --enable-amf --enable-cuda-llvm --enable-cuvid --enable-ffnvcodec --enable-nvdec --enable-nvenc --enable-d3d11va --enable-dxva2 --enable-libmfx --enable-libgme --enable-libopenmpt --enable-libopencore-amrwb --enable-libmp3lame --enable-libtheora --enable-libvo-amrwbenc --enable-libgsm --enable-libopencore-amrnb --enable-libopus --enable-libspeex --enable-libvorbis --enable-librubberband
//   libavutil      58.  2.100 / 58.  2.100
//   libavcodec     60.  3.100 / 60.  3.100
//   libavformat    60.  3.100 / 60.  3.100
//   libavdevice    60.  1.100 / 60.  1.100
//   libavfilter     9.  3.100 /  9.  3.100
//   libswscale      7.  1.100 /  7.  1.100
//   libswresample   4. 10.100 /  4. 10.100
//   libpostproc    57.  1.100 / 57.  1.100
// Input #0, mov,mp4,m4a,3gp,3g2,mj2, from './temp-files/mov_bbb.mp4':
//   Metadata:
//     major_brand     : mp42
//     minor_version   : 0
//     compatible_brands: mp42isomavc1
//     creation_time   : 2012-03-13T08:58:06.000000Z
//     encoder         : HandBrake 0.9.6 2012022800
//   Duration: 00:00:10.03, start: 0.000000, bitrate: 629 kb/s
//   Chapters:
//     Chapter #0:0: start 0.000000, end 10.000000
//       Metadata:
//         title           : Chapter 1
//   Stream #0:0[0x1](und): Video: h264 (Main) (avc1 / 0x31637661), yuv420p(tv, smpte170m/smpte170m/bt709, progressive), 320x176, 300 kb/s, 25 fps, 25 tbr, 90k tbn (default)
//     Metadata:
//       creation_time   : 2012-03-13T08:58:06.000000Z
//       vendor_id       : [0][0][0][0]
//       encoder         : JVT/AVC Coding
//   Stream #0:1[0x2](und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 160 kb/s (default)
//     Metadata:
//       creation_time   : 2012-03-13T08:58:06.000000Z
//       vendor_id       : [0][0][0][0]
//   Stream #0:2[0x3](und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 160 kb/s
//     Metadata:
//       creation_time   : 2012-03-13T08:58:06.000000Z
//       vendor_id       : [0][0][0][0]
//   Stream #0:3[0x4](und): Data: bin_data (text / 0x74786574), 0 kb/s
//     Metadata:
//       creation_time   : 2012-03-13T08:58:06.000000Z
// [out#0/webm @ 000002c2c4e12d40] Codec AVOption preset (Configuration preset) has not been used for any stream. The most likely reason is either wrong type (e.g. a video option with no video streams) or that it is a private option of some encoder which was not actually used for any stream.
// Stream mapping:
//   Stream #0:0 -> #0:0 (h264 (native) -> av1 (libaom-av1))
//   Stream #0:1 -> #0:1 (aac (native) -> aac (native))
// Press [q] to stop, [?] for help
// [libaom-av1 @ 000002c2c5051280] 3.6.0-276-gba3388ace
// [webm @ 000002c2c4dcf200] Only VP8 or VP9 or AV1 video and Vorbis or Opus audio and WebVTT subtitles are supported for WebM.
// [out#0/webm @ 000002c2c4e12d40] Could not write header (incorrect codec parameters ?): Invalid argument
// [vost#0:0/libaom-av1 @ 000002c2c4dcff40] Error initializing output stream:
// [aac @ 000002c2c504e380] Qavg: 150.661
// [aac @ 000002c2c504e380] 2 frames left in the queue on closing
// Conversion failed!
