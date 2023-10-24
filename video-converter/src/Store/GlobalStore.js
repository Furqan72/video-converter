import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useGlobalStore = defineStore('GlobalStore', () => {
  const selectedFormat = ref('...');
  const selectedFileFormat = ref('.mp4');
  const selectedImageFileFormat = ref('.jpg');
  const imageSelectedFormat = ref('.png');
  const fileSizeExceeded = ref(false);
  const fileSize = ref(null);
  const formatCheck = ref(false);
  const downloadUrlFromNode = ref('');
  const errMessage = ref('');
  const metaData = ref('');
  const downloadName = ref('');
  const markWrongFormat = ref(false);
  const uploadLoading = ref('');
  // active covnerter
  const activeConverter = ref('/');

  //  sending and receiving data from the server
  const sendVideoFile = async (formData, convert) => {
    console.log(formData, convert);
    console.log('http://localhost:4000/' + convert);

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
        console.log(downloadName.value, errMessage.value, metaData.value);
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

    // functions
    // updateSelectedFormat,
    sendVideoFile,
  };
});
