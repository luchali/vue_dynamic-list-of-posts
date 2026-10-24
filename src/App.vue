<script setup>
import { Comment, ref } from 'vue';
import LoginForm from './components/LoginForm.vue';
import WriteCommentBtn from './components/writeCommentBtn.vue';
import NeedToRegister from './components/NeedToRegister.vue';
import AppHeader from './components/AppHeader.vue';
import { getUserByEmail, createUser } from './api/users.js';
import PostsList from './components/PostsList.vue';
import { getPosts, createPost, updatePost, deletePost } from './api/posts.js';
import Sidebar from './components/Sidebar.vue';
import PostForm from './components/PostForm.vue';
import PostPreview from './components/PostPreview.vue';
import { getComments } from './api/comments.js';

const user = ref(null);
const loginEmail = ref('');
const needsRegistration = ref(false);
const posts = ref([]);
const comments = ref([]);

const isSidebarOpen = ref(false);
const selectedPost = ref(null);
const isCreatingPost = ref(false);
const isEditingPost = ref(false);

const errorMessage = ref('');
const loadPosts = async () => {
  try {
    posts.value = await getPosts(user.value.id);
  } catch {
    errorMessage.value = 'Unable to load posts';
  }
};

const handleSubmit = async (email) => {
  errorMessage.value = '';

  try {
    const foundUser = await getUserByEmail(email);

    if (foundUser) {
      user.value = foundUser;
      await loadPosts();
      return;
    }

    loginEmail.value = email;
    needsRegistration.value = true;
  } catch {
    errorMessage.value = 'Unable to load user';
  }
};

const handleRegister = async (name) => {
  errorMessage.value = '';

  try {
    const newUser = await createUser({
      name,
      email: loginEmail.value,
    });

    user.value = newUser;
    needsRegistration.value = false;
    await loadPosts();
  } catch {
    errorMessage.value = 'Unable to register user';
  }
};

const handleWriteComment = () => {
  console.log('Кнопку натиснуто! Тут можна відкрити форму коментаря.');

  isFormVisible.value = true;
};

const handleLogout = () => {
  user.value = null;
  loginEmail.value = '';
  needsRegistration.value = false;
  errorMessage.value = '';
};

const handleAddPost = () => {
  console.log('Додати новий пост');
  selectedPost.value = null;
  isCreatingPost.value = true;
  isSidebarOpen.value = true;
};

const handleOpenPost = (post) => {
  console.log('Відкрити пост:', post);
  selectedPost.value = post;
  isCreatingPost.value = false;
  isSidebarOpen.value = true;
};

const handleClosePost = (post) => {
  console.log('Закрити пост:', post);
  selectedPost.value = null;
  isCreatingPost.value = false;
  isSidebarOpen.value = false;
};

const handleCreatePost = async ({ title, body }) => {
  try {
    const newPost = await createPost({
      userId: user.value.id,
      title,
      body,
    });

    posts.value = [...posts.value, newPost];

    selectedPost.value = newPost;
    isCreatingPost.value = false;
    isSidebarOpen.value = true;
  } catch (error) {
    console.error(error);
  }
};

const handleEditPost = (post) => {
  console.log('Редагувати пост:', post);
  isEditingPost.value = true;
};

const handleSavePost = async ({ title, body }) => {
  try {
    const updatedPost = await updatePost({
      id: selectedPost.value.id,
      title,
      body,
    });

    posts.value = posts.value.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    );

    selectedPost.value = updatedPost;
    isEditingPost.value = false;
  } catch (error) {
    console.error(error);
  }
};

const handleDeletePost = async (post) => {
  console.log('Видалити пост:', post);
  try {
    const newPost = await deletePost({
      id: post.id,
    });

    posts.value = posts.value.filter(p => p.id !== post.id);

    selectedPost.value = null;
    isCreatingPost.value = false;
    isSidebarOpen.value = false;
  } catch (error) {
    console.error(error);
  }
};

const loadComments = async () => {
  try {
    comments.value = await getComments(selectedPost.value.id);
  } catch {
    errorMessage.value = 'Unable to load comments';
  }
};

</script>

<template>
<LoginForm 
    v-if="!user && !needsRegistration" 
    @submit-form="handleSubmit"
    :error-message="errorMessage"
    :has-error="Boolean(errorMessage)"
/>

<NeedToRegister
  v-else-if="!user && needsRegistration"
  :error-message="errorMessage"
  :has-error="Boolean(errorMessage)"
  :email="loginEmail"
  @register="handleRegister"
/>

<template v-else>
  <AppHeader :user="user" @logout="handleLogout" />

   <main class="container mt-6">
    <div class="posts-layout is-flex is-justify-content-space-between">
      <PostsList :posts="posts"
      :is-sidebar-open="isSidebarOpen"
      :selected-post="selectedPost"
      @add-post="handleAddPost" 
      @open-post="handleOpenPost" 
      @close-post="handleClosePost"
      />

    <Sidebar :is-open="isSidebarOpen">
        <PostForm
            v-if="isCreatingPost"
            @create-post="handleCreatePost"
            @cancel="handleClosePost"
        />

        <PostForm
            v-else-if="isEditingPost"
            :post="selectedPost"
            @save-post="handleSavePost"
            @cancel="isEditingPost = false"
        />

        <PostPreview
            v-else-if="selectedPost"
            :post="selectedPost"
            @edit-post="handleEditPost"
            @delete-post="handleDeletePost"
        />

        <WriteCommentBtn @write-comment="handleWriteComment" />
        <NoComments v-if="selectedPost && !comments.length" />
        <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
    </Sidebar>
    </div>
   </main>
</template>

</template>

<style scoped>
.posts-layout {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin: auto;
}
</style>