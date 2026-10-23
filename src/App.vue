<script setup>
import { ref } from 'vue';
import LoginForm from './components/LoginForm.vue';
import WriteCommentBtn from './components/writeCommentBtn.vue';
import NeedToRegister from './components/NeedToRegister.vue';
import AppHeader from './components/AppHeader.vue';
import { getUserByEmail, createUser } from './api/users.js';

const user = ref(null);
const loginEmail = ref('');
const needsRegistration = ref(false);

const errorMessage = ref('');

const handleSubmit = async (email) => {
  errorMessage.value = '';

  try {
    const foundUser = await getUserByEmail(email);

    if (foundUser) {
      user.value = foundUser;
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
  } catch {
    errorMessage.value = 'Unable to register user';
  }
};

const handleWriteComment = () => {
  console.log('Кнопку натиснуто! Тут можна відкрити форму коментаря.');
  // Наприклад, можна змінити стан якоїсь змінної, щоб показати форму:
  // isFormVisible.value = true;
};

const handleLogout = () => {
  user.value = null;
  loginEmail.value = '';
  needsRegistration.value = false;
  errorMessage.value = '';
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

  <WriteCommentBtn @write-comment="handleWriteComment" />
</template>

</template>

<style scoped></style>