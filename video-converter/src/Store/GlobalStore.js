import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('GlobalStore', () => {
  const fileSizeExceeded = ref(false);
  const fileSize = ref(null);
  const downloadUrlFromNode = ref('');
  const errMessage = ref('');
  const downloadName = ref('');
  const markWrongFormat = ref(false);
  const uploadLoading = ref('');

  const selectedFormat = ref('.avi');
  const updateSelectedFormat = (event) => {
    selectedFormat.value = event.target.value;
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

    // functions
    updateSelectedFormat,
  };
});
