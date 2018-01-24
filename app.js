const express = require('express');

const app = express();


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json()); // convert to Json

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});


app.post('/', (req, res) => { //read data from req body
    console.log(req.body.user.name)
  });
  
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});