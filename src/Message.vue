<script setup>
defineProps({ text: String });
</script>

<template>
  <article class="message" :class="{ 'message--hidden': !text }">
    <div class="message-header">
      <p>Error</p>
      <button class="delete"></button>
    </div>

    <div class="message-body">
      {{ text }}
    </div>
  </article>
</template>

<style scoped lang="scss">
.message {
  transform-origin: top center;
  transition-property: opacity, transform;
  transition-duration: .3s;

  &--hidden {
    transform: scaleY(0);
    opacity: 0;
    pointer-events: none;
  }
}
</style>
