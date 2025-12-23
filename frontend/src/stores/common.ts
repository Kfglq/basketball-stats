// src/stores/common.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { commonDefault } from '@/types/stores/common';

export const useCommonStore = defineStore('common', () => {
  const stateDefaults: commonDefault = {
    darkTheme: false,
    primaryColor: '#42b883',
    isLoading: false,
    error: null,
  };

  const darkTheme = ref(stateDefaults.darkTheme);
  const primaryColor = ref(stateDefaults.primaryColor);
  const isLoading = ref(stateDefaults.isLoading);
  const error = ref(stateDefaults.error);
  const isReady = computed(() => !isLoading.value && !error.value);

  const toggleTheme = () => {
    darkTheme.value = !darkTheme.value;
  }
  
  const setPrimaryColor = (color: string) => {
    primaryColor.value = color;
  }

  const setLoading = (status: boolean) => {
    isLoading.value = status;
  }

  const setError = (newError: string | null) => {
    error.value = newError;
  }

  return {
    darkTheme,
    primaryColor,
    isLoading,
    error,
    isReady,
    toggleTheme,
    setPrimaryColor,
    setLoading,
    setError,
  };
});
