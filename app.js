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
    console.log(req.body);
  //  get the action and entities 
  let action = req.body.result.action;
  let intentName =  req.body.metadata.intentName;
  let resolveQuery = req.body.resolveQuery;
  
    
  });
  
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});