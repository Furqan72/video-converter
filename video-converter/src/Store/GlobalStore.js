import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('GlobalStore', () => {
  const selectedFormat = ref('.avi');
  const updateSelectedFormat = (event) => {
    selectedFormat.value = event.target.value;
  };

  return {
    selectedFormat,

    // functions
    updateSelectedFormat,
  };
});
