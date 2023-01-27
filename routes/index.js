const express = require('express');
const router = express.Router();

const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
});
const promisePool = pool.promise();

module.exports = router;

router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT * FROM tf03forum");
    res.render('index.njk', {
        rows: rows,
        title: 'Forum',
    });
});

router.post('/new', async function (req, res, next) {
    const { author, title, content } = req.body;

    let user = await promisePool.query('SELECT * FROM tf03users WHERE name = ?', [author]);
    if (!user) {
        user = await promisePool.query('INSERT INTO tf03users (name) VALUES (?)', [author]);
    }

    console.log(user)

    const userId = user.insertId || user[0][0].id;

    const [rows] = await promisePool.query('INSERT INTO tf03forum (authorId, title, content) VALUES (?, ?, ?)', [userId, title, content]);
    res.redirect('/');
});

router.get('/new', async function (req, res, next) {
    const [users] = await promisePool.query('SELECT * FROM tf03users');
    res.render('new.njk', {
        title: 'Nytt inlägg',
        users,
    });
});