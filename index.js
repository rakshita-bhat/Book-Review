import express from 'express'
import pg from 'pg'
import bodyParser from 'body-parser'
import axios from 'axios'

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Book review',
  port: 5432,
  password: 'Raksh@122'
});
db.connect();

let books = [{isbn:  '0385472579' ,
    title: 'Last essays',
    read_date: '2023-04-15',
    author : 'Joseph Conrad',
    rating: 8,
    review:'A collection of thoughtful essays on various topics.'}];

 

app.get('/', async (req, res) => {
  try{
    const result = await db.query('SELECT * FROM books ORDER BY rating DESC;');
    const books = result.rows.map(book => {
      return {
        ...book,
        coverUrl: `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
      };
    });
    res.render('index.ejs',{books : books});
  }
  catch(err){
    console.error(err);
    res.status(500).send("Error retrieving books from the database");
  }
});

app.get('/add', (req, res)=>{
  res.render('add.ejs');
});

app.post('/add', async (req,res)=>{
  const { isbn, title, author, read_date, rating, review } = req.body;
  try{
    await db.query('INSERT INTO books (isbn, title, author, read_date, rating,review) VALUES ($1, $2, $3, $4, $5,$6)', [isbn, title, author, read_date, rating,review]);
    res.redirect('/');
  }catch(err){
    console.error(err);
    res.status(500).send("Error adding book to the database");
  }
  
});

app.get('/edit/:id', async (req, res)=>{
  const id = req.params.id;
  try{
    const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
    res.render('edit.ejs', {book : result.rows[0]});
  }catch(err){
    console.error(err);
    res.status(500).send("Error retrieving book from the database");
  }
});

app.post('/edit/:id', async (req,res)=>{
  const {title, author, read_date,rating,review} = req.body;
  const id = req.params.id;
  try{
    await db.query("UPDATE books SET title = $1, author = $2, read_date = $3, rating = $4, review = $5 WHERE id = $6", [title, author, read_date, rating, review, id]);
    res.redirect('/');
  }catch(err){
    console.error(err);
  }
});

app.post('/delete/:id', async (req, res)=>{
  const  id  = req.params.id;
  try{
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect('/');
  }catch(err){
    console.error(err);
    res.status(500).send("Error deleting book from the database");
  } 
});

app.listen(port, () => {
  console.log(`listening on port ${port}`)
});
