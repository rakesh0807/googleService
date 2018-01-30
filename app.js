const express = require('express');
var bodyParser = require('body-parser');
var proceseRequest = require("./reqProcessing/preparePost");
const app = express();
// Application development
//https://medium.com/google-cloud/how-to-create-a-custom-private-google-home-action-260e2c512fc 

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json()); // convert to Json

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.post('/', (req, res) => { //read data from req body
  let reqBody = req.body;
  console.log("Original Request body is " + JSON.stringify(req.body));
  if (reqBody.result) {
    if (reqBody.result && reqBody.result.contexts) {
      delete reqBody.result.contexts;
    }
    if (reqBody.result.fulfillment && reqBody.result.fulfillment.messages) {
      delete reqBody.result.fulfillment.messages;
    };
    if (reqBody.result.parameters) {
      delete reqBody.result.parameters;
    };

    proceseRequest(reqBody).then(
      function (resp) {
        if (resp.d) {
          console.log("\ninside if" + JSON.stringify(resp.d));
          resp.speech = resp.d.speech;
          resp.displayText = resp.d.displayText;
        } else {
          console.log("\ninside else");
          resp.speech = "Something went wrong ,Please try again";
          resp.displayText = "Something went wrong ,Please try again";
        }
        res.json(resp);
      }
    ).catch(
      function (error) {
        res.status(500).send(error).end();
      }
      );
  } else {
    res.status(200).send('Welcome to the app !!!').end();
  }

});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});