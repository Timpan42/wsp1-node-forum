const express = require('express');
const router = express.Router();

const promisePool = require('../utils/db.js');



//Home
router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT * FROM tf03forum");
    res.render('index.njk', {
        rows: rows,
        title: 'Home',
    });
});

//Forum
router.get('/forum', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT tf03forum.*, tf03users.name FROM tf03forum JOIN tf03users ON tf03forum.authorId = tf03users.id");
    res.render('forum.njk', {
        rows: rows,
        title: 'Forum',
    });
});

//New
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

module.exports = router;