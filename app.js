const express = require('express');
var bodyParser = require('body-parser');
var proceseRequest = require("./reqProcessing/preparePost");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json()); // convert to Json

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.post('/', (req, res) => { //read data from req body
  let reqBody = req.body;
  console.log("Request body is "+req.body);
  delete reqBody.result.contexts;
  if(reqBody.result.fulfillment && reqBody.result.fulfillment.messages){
    delete reqBody.result.fulfillment.messages;
  };
  if(reqBody.result.parameters){
    delete reqBody.result.parameters;
  };
  let action = req.body.result.action;
  let intentName =  req.body.result.metadata.intentName;
  let resolveQuery = req.body.result.resolveQuery;
  //console.log(reqBody);
  proceseRequest(req.body).then(
    function(resp){
      if(resp.d){
        console.log("\ninside if"+JSON.stringify(resp.d));
        resp.speech = resp.d.speech;
        resp.displayText = resp.d.displayText;

      }else{
        console.log("\ninside else");
        googleResp.speech = "Something went wrong ,Please try again";
        googleResp.displayText = "Something went wrong ,Please try again";
      }
     res.json(resp);
    }
  ).catch(
      function(error){
        res.status(500).send(error).end();
      }
  );
    
  });
  
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});