const express = require('express');
const bodyParser = require ('body-parser');
const app = express();
const port = 8000;
const studentsRouter = require('./datab.js');
const addRouter = require('./database.js');


app.use(bodyParser.urlencoded({extended:true}));

app.use('/', studentsRouter);
app.use('/', addRouter);


app.get("/", (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/add.html', (req, res) => {
res.sendFile(__dirname + '/add.html');});

app.get('/search.html', (req, res) => {
res.sendFile(__dirname + '/search.html');});

app.listen(port, () => {
	console.log(`App is listening to port ${port}`);
});
	