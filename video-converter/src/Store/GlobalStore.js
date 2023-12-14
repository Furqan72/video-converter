import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useGlobalStore = defineStore('GlobalStore', () => {
  // video
  const selectedFormat = ref('.avi');
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

  const deletedFile = ref();

  //  sending and receiving data from the server
  const sendVideoFile = async (formData, convert) => {
    console.log(typeof formData);
    // console.log(formData.get('ResolutionMenu'));

    await axios
      // .post('http://localhost:8080/' + convert, formData, {
      .post('https://video-converter-api.vercel.app/' + convert, formData, {
        withCredentials: false,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': true,
          Accept: 'application/json',
          // 'Access-Control-Allow-Origin': 'https://video-converter2.vercel.app',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          uploadLoading.value = percentCompleted;
        },
      })
      .then((response) => {
        downloadUrlFromNode.value = response.data.downloadUrl;
        // downloadName.value = response.data.fileName;
        deletedFile.value = response.data.filedeleted;
        metaData.value = response.data.metadata;
        if (response.data.errorMessage) {
          errMessage.value = response.data.errorMessage;
        } else {
          errMessage.value = '';
        }
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
    deletedFile,
    // imageSocket,

    // functions
    // updateSelectedFormat,
    sendVideoFile,
    // socketCheck,
  };
});
