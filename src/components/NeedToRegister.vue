<script setup>
import { ref } from 'vue';

defineProps({
  errorMessage: {
    type: String,
    default: ''
  },
  hasError: {
    type: Boolean,
    default: false
  }
});

const name = ref('');
</script>

<template>
<div class="field">
  <label class="label" for="user-name"> Your Name </label>

  <div class="control has-icons-left">
    <input
      v-model="name"
      type="text"
      id="user-name"
      name="name"
      class="input"
      placeholder="Enter your name"
      required
      minlength="{4}"
    />

    <span class="icon is-small is-left">
      <i class="fas fa-user" />
    </span>
  </div>
    <p v-if="hasError" class="help is-danger" data-cy="ErrorMessage">
        {{ errorMessage }}
    </p>
</div>
</template>

<style scoped></style>