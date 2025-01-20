import { ref } from 'vue';

export function useTitle() {
  const title = ref(document.title);

  function setTitle(newTitle: string) {
    title.value = newTitle;
  }

  return { setTitle };
}