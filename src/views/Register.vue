<template>
  <v-container class="d-flex justify-center">
    <v-card class="pa-5" max-width="400">
      <v-card-title>Регистрация</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="registerUser">
          <v-text-field
              label="Имя"
              outlined
              v-model="username"
              required
          ></v-text-field>
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
          <v-select
              label="Выберите роль"
              :items="roles"
              v-model="role"
              outlined
              required
          ></v-select>
          <v-btn
              color="primary"
              class="mt-4"
              block
              :loading="loading"
              @click="registerUser"
          >
            Зарегистрироваться
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
        <v-btn text to="/login">Уже есть аккаунт? Вход</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import api from '@/api/axios';

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      message: '',
      role: '', // Новая переменная для роли
      roles: ['Ученик', 'Учитель'], // Список ролей
      error: false,
      loading: false,
    };
  },
  methods: {
    async registerUser() {
      this.loading = true;
      this.message = '';
      try {
        const response = await api.post('/register', {
          username: this.username,
          email: this.email,
          password: this.password,
          role:this.role
        });
        this.message = `Пользователь ${response.data.username} успешно зарегистрирован!`;
        this.error = false;
      } catch (err) {
        this.error = true;
        this.message = err.response?.data?.error || 'Произошла ошибка. Попробуйте снова.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
