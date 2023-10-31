import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

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

  // socket.io progress and messges
  const allErrors = ref('');
  const progressElement = ref(0);
  // const progressElement = ref(0);

  //  sending and receiving data from the server
  const sendVideoFile = async (formData, convert) => {
    axios
      .post('http://localhost:4000/' + convert, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          uploadLoading.value = percentCompleted;
        },
      })
      .then((response) => {
        downloadUrlFromNode.value = 'http://localhost:4000/' + response.data.downloadUrl;
        downloadName.value = response.data.fileName;
        errMessage.value = response.data.message;
        metaData.value = response.data.fullVideoData;
        console.log('1 => ' + downloadName.value);
        console.log('2 => ' + errMessage.value);
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

    // functions
    // updateSelectedFormat,
    sendVideoFile,
  };
});
