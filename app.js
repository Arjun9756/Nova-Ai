import express from 'express';
import dotenv from 'dotenv';
import Gemini from './routes/Gemini.route.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('views'));

app.set('view engine', 'ejs');

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('Gemni');
});

// Gemini API routes
app.use('/gemini', Gemini);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});