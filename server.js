const express = require('express');
const mysql= require('mysql')
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'post_comment_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connection to database');
    } else {
        console.log('Connected to database');
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    connection.query('SELECT posts.*, GROUP_CONCAT(comments.text) AS comments FROM posts LEFT JOIN comments ON posts.id = comments.post_id GROUP BY posts.id', (error, results) => {
      if (error) throw error;
      res.render('index', { posts: results });
    });
});

app.post('/add', (req, res) => {
    const { text } = req.body;
    connection.query('INSERT INTO posts (text) VALUES (?)', [text], (error) => {
      if (error) throw error;
      res.redirect('/');
    });
});

app.post('/comment/:id', (req, res) => {
    const { text } = req.body;
    const postId = req.params.id;
    connection.query('INSERT INTO comments (post_id, text) VALUES (?, ?)', [postId, text], (error) => {
      if (error) throw error;
      res.redirect('/');
    });
});

app.post('/delete/:id', (req, res) => {
    const postId = req.params.id;
    connection.query('DELETE FROM posts WHERE id = ?', [postId], (error) => {
      if (error) throw error;
      res.redirect('/');
    });
});

app.post('/delete/:postId/:commentId', (req, res) => {
    const { postId, commentId } = req.params;
    connection.query('DELETE FROM comments WHERE id = ? AND post_id = ?', [commentId, postId], (error) => {
      if (error) throw error;
      res.redirect('/');
    });
});

app.listen(port, () => {
    console.log('Server is running');
});