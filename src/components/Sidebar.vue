<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <div
    class="tile is-parent box is-6 Sidebar"
    :class="{ 'Sidebar--open': isOpen }"
  >
    <div class="tile is-child is-success">
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.Sidebar {
  width: 0;
  opacity: 0;
  max-width: 0;
  overflow: hidden;

  transition:
    width 0.5s ease-in-out,
    max-width 0.5s ease-in-out,
    opacity 0.5s ease-in-out;
}

.Sidebar--open {
  width: 50%;
  max-width: 50%;
  opacity: 1;
}
/* .Sidebar {
  overflow: hidden;
  opacity: 0;
  width: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;

  @media (min-width: 769px) {
    max-width: 50%;
  }
} */
</style>