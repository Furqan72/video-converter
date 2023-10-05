import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('GlobalStore', () => {
  const selectedFormat = ref('...');
  const selectedFileFormat = ref('...');
  const fileSizeExceeded = ref(false);
  const fileSize = ref(null);
  const formatCheck = ref(false);
  const downloadUrlFromNode = ref('');
  const errMessage = ref('');
  const downloadName = ref('');
  const markWrongFormat = ref(false);
  const uploadLoading = ref('');

  return {
    selectedFormat,
    markWrongFormat,
    fileSizeExceeded,
    fileSize,
    errMessage,
    downloadUrlFromNode,
    downloadName,
    uploadLoading,
    formatCheck,
    selectedFileFormat,

    // functions
    // updateSelectedFormat,
  };
});
