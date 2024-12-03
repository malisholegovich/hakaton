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
          <v-list-item-title>Проекты</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Главное меню -->
    <v-main>
      <v-container>
        <!-- Заголовок -->
        <v-row justify="space-between" align="center">
          <v-col cols="auto">
            <h1>Ваши проекты</h1>
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" @click="openCreateProjectMenu">
              Создать проект
            </v-btn>
          </v-col>
        </v-row>

        <!-- Список проектов -->
        <v-row>
          <v-col
              v-for="(project, index) in projects"
              :key="index"
              cols="12"
              md="4"
          >
            <v-card>
              <v-card-title>{{ project.name }}</v-card-title>
              <v-card-subtitle>{{ project.description }}</v-card-subtitle>
              <v-card-actions>
                <v-btn text color="primary" @click="openProject(project)">
                  Открыть
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>


        <v-dialog v-model="projectMenuVisible" persistent max-width="600">
          <v-card>
            <v-card-title>Меню проекта</v-card-title>
            <v-card-text>
              <project-menu :project="currentProject" :project_id="currentId"/>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary" @click="closeProjectMenu">Закрыть</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <!-- Меню создания проекта -->
        <v-dialog v-model="createProjectVisible" persistent max-width="600">
          <v-card>
            <v-card-title>Создать проект</v-card-title>
            <v-card-text>
              <v-text-field
                  v-model="newProject.title"
                  label="Название проекта"
                  outlined
              ></v-text-field>
              <v-textarea
                  v-model="newProject.description"
                  label="Описание проекта"
                  outlined
                  rows="3"
              ></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary" @click="createProject">
                Создать
              </v-btn>
              <v-btn text color="error" @click="closeCreateProjectMenu">
                Отмена
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ProjectMenu from './ProjectMenu.vue';
import api from '@/api/axios';
export default {
  components: {
    ProjectMenu,
  },
  name: 'student',
  data() {
    return {
      drawer: false,
      userId:sessionStorage.getItem('userid'),
      username: sessionStorage.getItem('username'),
      projects: [],
      projectMenuVisible: false,
      createProjectVisible: false,
      currentProject: '',
      currentId: '',
      newProject: {
        title: '',
        description: '',
      },
    };
  },
  mounted() {
    // Загружаем проекты при загрузке страницы
    this.fetchProjects();
  },
  methods: {
    calendarik(){
      this.$router.push("/calendar");
    },
    async fetchProjects() {
      try {
        const response = await api.post('/projects', {
          userId: this.userId,
        });

        this.projects = response.data.projects;
        console.log(response.data)
      } catch (error) {
        console.error(error);
        alert('Ошибка загрузки проектов');
      }
    },
    async createProjects() {
      try {
        const response = await api.post('/create_projects', {
          userId: this.userId,
          name:this.newProject.title,
          description:this.newProject.description,
        });
      } catch (error) {
        console.error(error);
        alert('Ошибка создания проектов');
      }
    },
    // Открытие меню проекта
    openProject(project) {
      this.currentProject = project.name;
      this.currentId=project.id;
      this.projectMenuVisible = true;
    },
    // Закрытие меню проекта
    closeProjectMenu() {
      this.projectMenuVisible = false;
      this.currentProject = null;
    },
    // Открытие меню создания проекта
    openCreateProjectMenu() {
      this.newProject = { title: '', description: '' }; // Сбрасываем данные
      this.createProjectVisible = true;
    },
    // Закрытие меню создания проекта
    closeCreateProjectMenu() {
      this.createProjectVisible = false;
    },
    // Создание нового проекта
    createProject() {
      this.createProjects()
      if (this.newProject.title.trim()) {
        this.projects.push({
          name: this.newProject.title,
          description: this.newProject.description,
        });
        this.closeCreateProjectMenu();
      } else {
        alert('Введите название проекта');
      }
    },
  },
};
</script>

<style scoped>
/* Добавьте свои стили */
</style>
