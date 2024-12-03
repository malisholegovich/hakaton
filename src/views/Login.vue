<template>
  <v-container class="d-flex justify-center">
    <v-card class="pa-5" max-width="400">
      <v-card-title>Вход</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="loginUser">
          <v-text-field
              label="Электронная почта"
              outlined
              v-model="email"
              required
          ></v-text-field>
          <v-text-field
              label="Пароль"
              type="password"
              outlined
              v-model="password"
              required
          ></v-text-field>

          <v-btn
              color="primary"
              class="mt-4"
              block
              :loading="loading"
              @click="loginUser"
          >
            Войти
          </v-btn>
        </v-form>
        <v-alert
            v-if="message"
            :type="error ? 'error' : 'success'"
            class="mt-4"
        >
          {{ message }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn text to="/register">Нет аккаунта? Регистрация</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import api from '@/api/axios';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      message: '',
      error: false,
      loading: false,
    };
  },

  methods: {
    async loginUser() {
      this.loading = true;
      this.message = '';
      try {
        const response = await api.post('/login', {
          email: this.email,
          password: this.password,
        });

        // Обработка успешного входа
        const { username, role ,id} = response.data;
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userid');
        sessionStorage.removeItem('teacherid');
        sessionStorage.removeItem('teacher');
// Получаем роль с сервера
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('userid', id);
        sessionStorage.setItem('teacher', role);

        this.error = false;
        console.log(role)
        // Перенаправление в зависимости от роли
        if (role) {
          sessionStorage.setItem('teacherid', id);
          this.$router.push('/teacher-dashboard');
        } else {
          this.$router.push('/student-dashboard');
        }
      } catch (err) {
        this.error = true;
        this.message = err.response?.data?.error || err.message || 'Произошла ошибка. Попробуйте снова.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

