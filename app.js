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
  res.status(200).send('Welcome to the agent').end();
});

app.post('/', (req, res) => { //read data from req body
  let reqBody = Object.assign({}, req.body);
  //console.log("Original Request body is " + JSON.stringify(req.body));

  let sapbodyData = {};
  if (reqBody.originalRequest) {
    delete reqBody.originalRequest;
  }
  if (reqBody.result) {
    // if (reqBody.result && reqBody.result.contexts) {
    //   delete reqBody.result.contexts;
    // }
    // if (reqBody.result.fulfillment && reqBody.result.fulfillment.messages) {
    //   delete reqBody.result.fulfillment.messages;
    // };
    // if (reqBody.result.parameters) {
    //   delete reqBody.result.parameters;
    // };
    // if (reqBody.result.metadata && reqBody.result.metadata.matchedParameters) {
    //   delete reqBody.result.metadata.matchedParameters;
    // };
    sapbodyData.id = reqBody.id;
    sapbodyData.timestamp =reqBody.timestamp;

    if(reqBody.result.resolvedQuery){
      sapbodyData.resolvedQuery = reqBody.result.resolvedQuery
    }
    if(reqBody.result.action){
      sapbodyData.action = reqBody.result.action
    }



    proceseRequest(sapbodyData).then(
      function (resp) {
        console.log("\n Resp in app" + JSON.stringify(resp.d));
        let googleResp = {};
        if (resp.d) {
          googleResp.speech = resp.d.speech;
          googleResp.displayText = resp.d.displayText;
        } else {
          googleResp.speech = "Something went wrong ,Please try again";
          googleResp.displayText = "Something went wrong ,Please try again";
        }
        res.json(googleResp).end();
      }
    ).catch(
      function (error) {
        console.log("\n Error  in app" + error);
        error.speech = "There is an error occured while getting values";
        error.displayText = "There is an error occured while getting values";
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