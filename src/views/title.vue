<template>
    <Title :title="title" />
  </template>
  
  <script setup lang="ts">
  import { defineProps, onMounted, onUnmounted } from 'vue';
  import { useTitle } from '/src/func/useTitle.ts';
  
  const props = defineProps({
    title: String
  });
  
  const { setTitle } = useTitle();
  
  onMounted(() => {
    setTitle(props.title);
  });
  
  onUnmounted(() => {
    setTitle('');
  });
  </script>