import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import student from '@/views/student.vue'
import teacher from '@/views/teacher.vue'
import calendar from '@/views/calendar.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
    },
    {
        path: '/teacher-dashboard',
        name: 'teacher',
        component: teacher,
    },
    {
        path: '/student-dashboard',
        name: 'student',
        component: student,
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: calendar,
    },
    {
        path: '/', // Корневой маршрут
        redirect: '/login', // Перенаправление на /login
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
