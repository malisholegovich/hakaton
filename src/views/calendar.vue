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
          <v-list-item-title>Расписание</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-title @click="teachers" v-if="teacher">Ученики</v-list-item-title>
          <v-list-item-title @click="student" v-else>Проекты</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Основная часть с календарем -->
    <v-main>
      <v-container>
        <div class="calendar-container">
          <v-date-picker
              mode="date"
              @update:model-value="onDateSelect"
              :attributes="calendarAttributes"
              class="custom-calendar"
          ></v-date-picker>

          <div v-if="selectedDate" class="reminder-panel">
            <h3>Напоминания на {{ formatDate(selectedDate) }}</h3>
            <ul>
              <li v-for="(reminder, index) in reminders[selectedDate]" :key="index">
                {{ reminder }}
                <button @click="deleteReminder(index)">Удалить</button>
              </li>
            </ul>
            <input v-model="newReminder" placeholder="Добавить напоминание" />
            <button @click="addReminder">Добавить</button>
          </div>

        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import api from '@/api/axios'; // Импорт API для отправки запросов

export default {
  name: 'calendar',
  data() {
    return {
      selectedDate: null,
      drawer:false,
      username:sessionStorage.getItem("username"),// Хранит выбранную дату
      teacher:sessionStorage.getItem("teacher"),// Хранит выбранную дату
      newReminder: '', // Новое напоминание
      reminders: {}, // Объект для хранения напоминаний
    };
  },
  computed: {
    calendarAttributes() {
      return Object.keys(this.reminders).map((date) => ({
        dates: new Date(date),
        customData: { hasReminders: true },
        highlight: {
          backgroundColor: '#ffeb3b',
          border: '2px solid #fbc02d',
        },
      }));
    },
  },
  methods: {
    teachers(){
      this.$router.push('/teacher-dashboard');
    },
    student(){
      this.$router.push('/student-dashboard');
    },

    // Загрузка всех напоминаний
    async loadReminders() {
      try {
        const response = await api.get('/get-reminders');
        const reminders = response.data;
        console.log("жопа",reminders)
        // Группируем напоминания по дате
        this.reminders = reminders.reduce((acc, reminder) => {
          const date = this.formatDate(reminder.data); // Поле data с датой
          console.log('Loaded reminder date:', date); // Проверим, что приходит дата
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(reminder.notification);
          return acc;
        }, {});

        console.log('Reminders by date:', this.reminders); // Проверим результат
      } catch (error) {
        console.error('Ошибка при загрузке напоминаний:', error);
        alert('Ошибка загрузки напоминаний');
      }
    },

    onDateSelect(date) {
      this.selectedDate = this.formatDate(date);
      console.log(this.selectedDate);
      console.log(this.reminders[this.selectedDate])
    },
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Месяц начинается с 0, добавляем 1
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    addReminder() {
      if (!this.newReminder.trim()) return;

      const date = this.selectedDate;
      if (!this.reminders[date]) {
        this.reminders[date] = [];
      }

      this.reminders[date].push(this.newReminder.trim());
      this.saveReminder(date, this.newReminder.trim()); // Сохранение напоминания в БД

      this.newReminder = ''; // Очистка поля ввода
    },
    deleteReminder(index) {
      const date = this.selectedDate;
      console.log(this.reminders[date][index])
      this.removeReminderFromDb(date, this.reminders[date][index]);
      this.reminders[date].splice(index, 1);

      if (!this.reminders[date].length) {
        delete this.reminders[date]; // Удаление даты, если напоминаний больше нет
      }// Удаление напоминания из БД
    },
    async saveReminder(date, reminder) {
      try {
        await api.post('/save-reminder', {
          date: date,
          notification: reminder,
        });
      } catch (error) {
        console.error('Ошибка при сохранении напоминания:', error);
        alert('Ошибка сохранения напоминания');
      }
    },
    async removeReminderFromDb(date, name) {
      try {
        await api.delete('/remove-reminder', {
          data: {
            date: date,
            name: name,
          },
        });
      } catch (error) {
        console.error('Ошибка при удалении напоминания:', error);
        alert('Ошибка удаления напоминания');
      }
    },
  },
  mounted() {
    // Загрузка напоминаний при монтировании компонента
    this.loadReminders();
  },
};

</script>

<style scoped>
.calendar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.custom-calendar {
  max-width: 500px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.reminder-panel {
  max-width: 500px;
  width: 100%;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.reminder-panel h3 {
  margin: 0 0 10px;
}

.reminder-panel ul {
  list-style: none;
  padding: 0;
  margin: 0 0 10px;
}

.reminder-panel ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.reminder-panel input {
  width: calc(100% - 100px);
  padding: 5px;
  margin-right: 10px;
}

.reminder-panel button {
  padding: 5px 10px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.reminder-panel button:hover {
  background: #0056b3;
}
</style>
