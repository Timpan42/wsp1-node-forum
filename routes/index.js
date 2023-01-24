const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
    res.render('index.njk',{
        title:'Home'
    })
});

router.post('/new', async function (req, res, next) {
    const { author, title, content } = req.body;

    // Skapa en ny författare om den inte finns men du behöver kontrollera om användare finns!
    let user = await promisePool.query('SELECT * FROM tf03users WHERE name = ?', [author]);
    if (!user) {
        user = await promisePool.query('INSERT INTO tf03users (name) VALUES (?)', [author]);
    }

    // user.insertId bör innehålla det nya ID:t för författaren

    const userId = user.insertId || user[0].id;

    // kör frågan för att skapa ett nytt inlägg
    const [rows] = await promisePool.query('INSERT INTO tf03forum (author, title, content) VALUES (?, ?, ?)', [userId, title, content]);
    res.redirect('/'); // den här raden kan vara bra att kommentera ut för felsökning, du kan då använda tex. res.json({rows}) för att se vad som skickas tillbaka från databasen
});


// router.post('/new', async function (req, res, next) {
//     const { author, title, content } = req.body;
//     const [rows] = await promisePool.query("INSERT INTO tf03forum (authorId, title, content) VALUES (?, ?, ?)", [author, title, content]);
//     res.redirect('/');

// });

router.get('/new', async function (req, res, next) {
    const [users] = await promisePool.query('SELECT * FROM tf03users');
    res.render('new.njk', {
        title: 'Nytt inlägg',
        users,
    });
});

const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
});
const promisePool = pool.promise();

router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT * FROM tf03forum");
    res.json({ rows });

    res.render('/index.njk', {
        rows: rows,
        title: 'Forum',
    });
});

module.exports = router;
