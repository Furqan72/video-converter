import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import io from 'socket.io-client';

export const useGlobalStore = defineStore('GlobalStore', () => {
  // video
  const selectedFormat = ref('...');
  const selectedFileFormat = ref('.mp4');

  // images
  const selectedImageFileFormat = ref('.jpg');
  const imageSelectedFormat = ref('.png');

  // for file-upload components
  const fileSizeExceeded = ref(false);
  const fileSize = ref(null);
  const formatCheck = ref(false);
  const uploadLoading = ref('');

  // download link
  const downloadUrlFromNode = ref('');
  const downloadName = ref('');

  // error messages from server
  const errMessage = ref('');

  // for temporary metadata
  const metaData = ref('');

  // watermark component
  const markWrongFormat = ref(false);

  // active covnerter > navbar
  const activeConverter = ref('/');

  // env variable
  const moduleUrl = import.meta.env.VITE_ROOT_URL;

  // socket.io progress and messges
  const allErrors = ref('');
  const progressElement = ref(0);

  // socket events for client side
  const socketCheck = (imageSocket) => {
    // messages from server
    imageSocket.on('message', (message) => {
      errMessage.value = message;
    });
    // errors from server
    imageSocket.on('errMessage', (errorMessage) => {
      errMessage.value = errorMessage;
    });
    // progess
    imageSocket.on('progress', (progressPercent) => {
      progressElement.value = progressPercent;
    });
  };

  //  sending and receiving data from the server
  const sendVideoFile = async (formData, convert) => {
    // console.log('Form Data +-?> ' + formData);
    // console.log(formData);

    axios
      // .post('https://video-converter-api.vercel.app/test', formData, {
      .post('http://localhost:8080/test', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          uploadLoading.value = percentCompleted;
        },
      })
      .then((response) => {
        console.log(response.data);
        downloadUrlFromNode.value = 'https://video-converter-api.vercel.app/./temp-output/converted-image-1kb.png';

        downloadUrlFromNode.value = 'http://localhost:8080/' + response.data.downloadUrl;
        // downloadUrlFromNode.value = 'http://localhost:8080/' + response.data.downloadUrl;
        downloadName.value = response.data.fileName;
        errMessage.value = response.data.message;
        metaData.value = response.data.fullVideoData;

        console.log(downloadUrlFromNode.value);
        console.log(downloadName.value);
        console.log(errMessage.value);
        console.log(metaData.value);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  return {
    selectedFormat,
    markWrongFormat,
    fileSizeExceeded,
    fileSize,
    errMessage,
    downloadUrlFromNode,
    downloadName,
    uploadLoading,
    metaData,
    formatCheck,
    selectedFileFormat,
    activeConverter,
    selectedImageFileFormat,
    imageSelectedFormat,
    allErrors,
    progressElement,
    // imageSocket,

    // functions
    // updateSelectedFormat,
    sendVideoFile,
    socketCheck,
  };
});
