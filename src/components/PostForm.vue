<script setup>
import { ref } from 'vue';

const emit = defineEmits(['create-post', 'cancel']);

const title = ref('');
const body = ref('');

const handleSubmit = () => {
  emit('create-post', {
    title: title.value,
    body: body.value,
  });
};
</script>

<template>
    <div class="content">
        <h2>Create new post</h2>

        <form @submit.prevent="handleSubmit">
            <!-- inputs... -->
        <div class="field">
            <label class="label">Title</label>

            <div class="control">
                <input
                    v-model="title"
                    class="input"
                    type="text"
                    placeholder="Post title"
                />
            </div>
        </div>

        <div class="field">
            <label class="label">Write Post Body</label>

            <div class="control">
                <textarea
                    v-model="body"
                    class="input"
                    type="textarea"
                    placeholder="Post body"
                ></textarea>
            </div>
        </div>

            <div class="field is-grouped">
            <div class="control">
                <button type="submit" class="button is-link">Save</button>
            </div>
            <div class="control">
                <button type="reset" 
                    class="button is-link is-light"
                    @click="$emit('cancel')"
                    >Cancel
                </button>
            </div>
            </div>
        </form>
    </div>

</template>

<style></style>