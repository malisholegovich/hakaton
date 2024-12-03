<template>
  <v-container>
    <!-- Заголовок -->
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="auto">
        <h1 class="text-center">{{ project }}</h1>
      </v-col>
      <v-col cols="auto" class="d-flex justify-end">
        <v-btn icon color="primary" @click="addTask" >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Список задач -->
    <v-list class="w-100">
      <v-list-item
          v-for="(task, index) in tasks"
          :key="index"
          class="align-center justify-space-between w-100"
      >
        <div class="task-row d-flex align-center">
          <!-- Если задача новая (редактируется) -->
          <template v-if="task.isNew" class="jopa">
            <v-text-field
                v-model="task.title"
                placeholder="Введите название задачи"
                class="mr-3 flex-grow-1"
                outlined
                dense
                width="100"
            ></v-text-field>
            <v-btn icon color="success" @click="saveTask(index)" class="mr-2" >
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </template>

          <!-- Если задача обычная -->
          <template class="w-100" v-else>
            <v-checkbox
                v-model="task.completed"
                class="mr-3"
                @change="updateProgress"
                hide-details
            ></v-checkbox>
            <div class="flex-grow-1 w-100">
              <v-list-item-title>{{ task.title }}</v-list-item-title>
            </div>
            <v-btn icon color="error" @click="removeTask(index)" class="mr-2">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </div>
      </v-list-item>
    </v-list>


    <!-- Прогресс -->
    <v-row justify="center" class="my-4">
      <v-progress-circular
          :value="completionPercentage"
          color="primary"
          size="100"
          width="10"
      >
        {{ completionPercentage }}%
      </v-progress-circular>
    </v-row>

    <!-- Сохранение -->
    <v-row justify="center">
      <v-btn color="success" class="mt-4" @click="saveProject">
        Сохранить проект
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import api from '@/api/axios';
import login from "@/views/Login.vue";
import {task} from "@vue/cli-plugin-eslint/ui/taskDescriptor";
export default {
  props: {
    project: {
      type: String,
      required: true,
    },
    project_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tasks: [
        { title: '', completed: false,isNew: true},
        { title: 'Вторая задача', completed: true },
      ],
    };
  },
  created() {
    this.loadTasks(); // Загрузка задач при создании компонента
  },
  computed: {
    // Рассчитать процент выполнения задач
    completionPercentage() {
      const completedTasks = this.tasks.filter((task) => task.completed).length;
      return Math.round((completedTasks / this.tasks.length) * 100) || 0;
    },
  },
  methods: {
    // Добавление задачи
    addTask() {
      this.tasks.push({ title: "", completed: false, isNew: true });
    },
    // Удаление задачи
    async removeTask(index) {
      const task = this.tasks[index];
      // Если задача имеет id, удаляем её из базы данных
      console.log(task)
      if (task.id) {
        try {
          const response = await api.post('/remove-task', { id: task.id });
          console.log(response.data.message); // Успешное сообщение от сервера
        } catch (error) {
          console.error('Ошибка при удалении задачи:', error);
        }
      }

      // Удаление задачи из массива
      this.tasks.splice(index, 1);
    },
    // Обновление прогресса
    updateProgress() {
      this.$forceUpdate(); // Перерисовка прогресса
    },
    // Сохранение проекта
    saveTask(index) {
      if (this.tasks[index].title.trim() === "") {
        alert("Название задачи не может быть пустым!");
        return;
      }
      this.tasks[index].isNew = false; // Перевод задачи в обычное состояние
      this.updateProgress();
    },
    async saveProject() {
      try {
        console.log(this.tasks)
        // Создание массива задач для отправки
        const payload = this.tasks.map((task) => ({
          name: task.title, // Название задачи
          done: task.completed,
          id:task.id// Выполнена или нет
        }));

        // Отправка POST-запроса
        const response = await api.post('/save-tasks', {
          projectId: this.project_id,
          tasks: payload,
        });

        if (response.status === 200) {
          alert('Проект успешно сохранён!');
        } else {
          alert('Ошибка при сохранении проекта.');
        }
      } catch (error) {
        console.error('Ошибка при сохранении проекта:', error);
        alert('Не удалось сохранить проект.');
      }
    },
    async loadTasks() {
      try {
        // Отправка POST-запроса для получения задач
        const response = await api.post('/tasks', { projectId: this.project_id });
        if (response.status === 200 && Array.isArray(response.data.tasks)) {
          // Преобразование полученных данных в формат задач компонента
          this.tasks = response.data.tasks.map((task) => ({
            id: task.id,              // ID задачи
            title: task.name,         // Название задачи
            completed: task.done,     // Выполнена ли задача
            isNew: false,             // Отмечаем, что задача не новая
          }));
        } else {
          alert('Не удалось загрузить задачи.');
        }
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
        alert('Ошибка при загрузке задач.');
      }
    },
    // Закрытие меню
  },

};

</script>












<style scoped>
.task-row {
  display: flex;
  align-items: center;
  width: 100%;
}

/* Гибкое пространство между элементами */
.flex-grow-1 {
  flex-grow: 1;
}

/* Убираем лишние отступы */
.v-list-item {
  padding: 0;
}

</style>
