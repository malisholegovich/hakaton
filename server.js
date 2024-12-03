require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const port = 8080;
app.use(cors());
// Настройка подключения к базе данных
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware для работы с JSON
app.use(express.json());

// Регистрация пользователя
app.post('/register', async (req, res) => {
    const { username, password,email ,role} = req.body;
    let roles=false
    try {
        // Проверка существования пользователя
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Такой пользователь уже существует' });
        }
        if (role==="Учитель"){
            roles=true
        }
        // Добавление нового пользователя
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await pool.query(
            'INSERT INTO users (username, password,email,teacher) VALUES ($1, $2, $3,$4) RETURNING *',
            [username, hashedPassword, email,roles]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/create_projects', async (req, res) => {
    const { userId, name,description} = req.body;
    try {
        // Добавление нового пользователя
        const proj = await pool.query(
            'INSERT INTO projects (user_id, name,description) VALUES ($1, $2, $3) RETURNING *',
            [userId, name, description]
        );
        res.status(201)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Проверка существования пользователя
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Проверка наличия email и password
    if (!email || !password) {
        return res.status(400).json({ error: 'Электронная почта и пароль обязательны.' });
    }

    try {
        // Поиск пользователя по email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Пользователь не найден.' });
        }

        const user = result.rows[0];

        // Проверка пароля (пример без хеширования)
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Неверный пароль.' });
        }
        console.log(user)
        // Возврат имени пользователя и роли
        res.json({ username: user.username, role: user.teacher ,id:user.id});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера. Попробуйте позже.' });
    }
});// Проверка существования пользователя
app.post('/projects', async (req, res) => {

    const { userId} = req.body;

    // Проверка наличия email и password
    try {
        // Поиск пользователя по email
        const result = await pool.query('SELECT name,description,id FROM projects WHERE user_id = $1', [userId]);
        console.log(result.rows)
        res.json({ projects: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера. Попробуйте позже.' });
    }
});
app.post('/tasks', async (req, res) => {

    const { projectId} = req.body;

    // Проверка наличия email и password
    try {
        // Поиск пользователя по email
        const result = await pool.query('SELECT name,done,id FROM tasks WHERE project_id = $1', [projectId]);
        console.log(result.rows)
        res.json({ tasks: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера. Попробуйте позже.' });
    }
});
app.post('/save-tasks', async (req, res) => {
    const { projectId, tasks } = req.body;

    if (!projectId || !tasks || !Array.isArray(tasks)) {
        return res.status(400).send({ message: 'Неверный запрос.' });
    }

    try {
        for (const task of tasks) {
            // Если id существует, обновляем задачу, если нет — создаем новую
            if (task.id) {
                // Обновление задачи
                await pool.query(
                    `UPDATE tasks SET name = $1, done = $2 WHERE id = $3`,
                    [task.name, task.done, task.id]
                );
            } else if (task.name && task.name.trim() !== "") {
                // Создание новой задачи, если name не пустое
                await pool.query(
                    `INSERT INTO tasks (project_id, name, done) 
                    VALUES ($1, $2, $3)`,
                    [projectId, task.name, task.done]
                );
            }
        }

        res.status(200).send({ message: 'Задачи успешно сохранены.' });
    } catch (error) {
        console.error('Ошибка при сохранении задач:', error);
        res.status(500).send({ message: 'Ошибка при сохранении задач.' });
    }
});
app.post('/remove-task', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send({ message: 'Неверный запрос. Не указан ID задачи.' });
    }

    try {
        // Удаляем задачу из базы данных
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);

        res.status(200).send({ message: 'Задача успешно удалена.' });
    } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
        res.status(500).send({ message: 'Ошибка при удалении задачи.' });
    }
});
app.post('/save-reminder', async (req, res) => {
    const { date, notification } = req.body;

    if (!date || !notification) {
        return res.status(400).send({ message: 'Дата или напоминание не указаны.' });
    }

    try {
        await pool.query(
            'INSERT INTO dates (data, notification) VALUES ($1, $2)',
            [date, notification]
        );
        res.status(200).send({ message: 'Напоминание успешно сохранено.' });
    } catch (error) {
        console.error('Ошибка при сохранении напоминания:', error);
        res.status(500).send({ message: 'Ошибка при сохранении напоминания.' });
    }
});
app.delete('/remove-reminder', async (req, res) => {
    const { date, name } = req.body;
    console.log(date,name)
    if (!date || name === undefined) {
        return res.status(400).send({ message: 'Дата или индекс не указаны.' });
    }

    try {
        await pool.query('DELETE FROM dates WHERE data = $1 AND notification = $2', [
            date,
            name, // В идеале, это должен быть уникальный идентификатор напоминания
        ]);
        res.status(200).send({ message: 'Напоминание успешно удалено.' });
    } catch (error) {
        console.error('Ошибка при удалении напоминания:', error);
        res.status(500).send({ message: 'Ошибка при удалении напоминания.' });
    }
});
// Запрос для получения всех напоминаний
app.get('/get-reminders', async (req, res) => {
    try {
        // Запрос на выборку всех напоминаний
        const result = await pool.query('SELECT * FROM dates');
        res.status(200).send(result.rows); // Отправляем результат
    } catch (error) {
        console.error('Ошибка при загрузке напоминаний:', error);
        res.status(500).send({ message: 'Ошибка при загрузке напоминаний.' });
    }
});

app.get('/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username FROM users WHERE teacher = false');
        res.status(200).json({ students: result.rows });
    } catch (error) {
        console.error('Ошибка получения списка учеников:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
