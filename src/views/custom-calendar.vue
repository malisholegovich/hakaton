<template>
  <v-container>
    <v-row justify="center" class="my-4">
      <v-col cols="12" md="8">
        <!-- Календарь -->
        <v-sheet>
          <v-calendar
              ref="calendar"
              v-model="selectedDate"
              color="primary"
              show-adjacent-months
              locale="ru"
              @click:date="selectDate"
          ></v-calendar>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Список напоминаний -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="text-h6">Напоминания на {{ selectedDate }}</span>
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item v-for="(reminder, index) in reminders[selectedDate] || []" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ reminder }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon color="error" @click="removeReminder(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-text-field
              v-model="newReminder"
              label="Добавить напоминание"
              outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="addReminder">Добавить</v-btn>
          <v-btn text @click="dialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: null, // Выбранная дата
      dialog: false, // Состояние диалога
      newReminder: '', // Новое напоминание
      reminders: {}, // Хранение напоминаний
    };
  },
  methods: {
    // Открытие диалога для выбранной даты
    selectDate({ date }) {
      this.selectedDate = date;
      if (!this.reminders[date]) {
        this.$set(this.reminders, date, []);
      }
      this.dialog = true;
    },
    // Добавление напоминания
    addReminder() {
      if (this.newReminder.trim() !== '') {
        this.reminders[this.selectedDate].push(this.newReminder);
        this.newReminder = '';
      }
    },
    // Удаление напоминания
    removeReminder(index) {
      this.reminders[this.selectedDate].splice(index, 1);
    },
  },
};
</script>

<style scoped>
/* Стили для выравнивания и улучшения визуального отображения */
.v-calendar {
  background-color: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
}
.v-list-item {
  margin-bottom: 5px;
}
</style>
