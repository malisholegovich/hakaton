<template>
  <v-app>
    <!-- Хедер -->
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Кванториум</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text>{{ username }}</v-btn>
    </v-app-bar>

    <!-- Выездное меню -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">Меню</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link>
          <v-list-item-title @click="calendarik">Расписание</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-title>Ученики</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Главное меню -->
    <v-main>
      <v-container>
        <!-- Заголовок -->
        <v-row justify="space-between" align="center">
          <v-col cols="auto">
            <h1>Список учеников</h1>
          </v-col>
        </v-row>

        <!-- Список учеников -->
        <v-row>
          <v-col
              v-for="(student, index) in students"
              :key="index"
              cols="12"
              md="4"
          >
            <v-card>
              <v-card-title>{{ student.username }}</v-card-title>
              <v-card-actions>
                <v-btn text color="primary" @click="openStudentProfile(student)">
                  Перейти в профиль
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import api from '@/api/axios';
import calendar from "@/views/calendar.vue";
export default {
  name: 'teacher',
  computed: {
    calendar() {
      return calendar
    }
  },
  data() {
    return {
      drawer: false,
      userId: sessionStorage.getItem('teacherid'),
      username: sessionStorage.getItem('username'),
      students: [], // Список учеников
    };
  },
  mounted() {
    // Загружаем список учеников при загрузке страницы
    this.fetchStudents();
  },
  methods: {
    calendarik(){
      this.$router.push("/calendar");
    },
    async fetchStudents() {
      try {
        const response = await api.get('/students');
        this.students = response.data.students; // Присваиваем данные
      } catch (error) {
        console.error('Ошибка загрузки учеников:', error);
        alert('Ошибка загрузки учеников');
      }
    },
    // Открытие профиля ученика
    openStudentProfile(student) {
      sessionStorage.setItem('userid', student.id);
      this.$router.push("/student-dashboard");
    },
  },
};
</script>


