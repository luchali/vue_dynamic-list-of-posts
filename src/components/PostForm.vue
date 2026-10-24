<script setup>
import { ref } from 'vue';

const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
});

const title = ref(props.post?.title ?? '');
const body = ref(props.post?.body ?? '');

const emit = defineEmits(['create-post', 'save-post', 'cancel']);

const handleSubmit = () => {
  if (props.post) {
    emit('save-post', {
      title: title.value,
      body: body.value,
    });

    return;
  }

  emit('create-post', {
    title: title.value,
    body: body.value,
  });
};
</script>

<template>
    <div class="content">
        <h2>
            {{ post ? 'Edit post' : 'Create new post' }}
        </h2>

        <form @submit.prevent="handleSubmit">
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