const request = require("request");
const http = require("http");
let API_TOKEN_URL = "https://thdapiqae.homedepot.com/minstance/auth/oauth/v2/token";
// let url = "http://ln04ca.homedepot.com:8002/sap/opu/odata/sap/ZCAM_GTEST_SRV/WebHookReqSet?sap-client=500"
// let fetchurl = "http://ln04ca.homedepot.com:8002/sap/opu/odata/sap/ZCAM_GTEST_SRV/$metadata?sap-client=500"
let url = "https://thdapiqae.homedepot.com/ad/sap/opu/odata/sap/ZCAM_COACH_SRV/CAMDetailsSet?sap-client=500"
let csrfUrl = "https://thdapiqae.homedepot.com/ad/sap/opu/odata/sap/ZCAM_COACH_SRV/$metadata?sap-client=500"

// Main method that is exported 
var getDataFromBackcend = function (data) {
  console.log("\nProcessed Request to SAP " + JSON.stringify(data));
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // need to check SSL certificate issue
  //return getResultFromSAP();

  return new Promise(
    function (resolve, reject) {
      let formbody = "grant_type=client_credentials&client_id=730ae2de-79cb-46f2-bf87-b712dc063c51&client_secret=410b4fd8-6084-4a7e-849c-41b0729929da&scope=sapbot.all"
      //var contentLength = formbody.length;
      request.post(
        {
          url: API_TOKEN_URL,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formbody,
        }, function (error, response, body) {
          if (error) {
            console.log("\nError from contacting API gateway token :" + error);
            reject(error);
          } else {
            //console.log("\nResponse  from API gateway token :" + response);
            //console.log("\nResponse Body  from API gateway token :" + body);
            if(typeof body === "string")
            {
              body = JSON.parse(body);
            }
            let accessToken = body.access_token;
            var cookieJar = request.jar();
            request.get(
              {
                url: csrfUrl,
                //  auth: {
                //   user: '',
                //   password: ''
                // },
                // headers: {
                //   "Authorization": "Basic USERANDPWINBASE64",
                //   "X-CSRF-Token": "Fetch"
                // },
                jar: cookieJar,
                headers: {
                  "Authorization": "Bearer " + accessToken,
                  "X-CSRF-Token": "Fetch",
                  "Cache-Control": "no-cache"
                },
              }, function (error, response, body) {
                if (error) {
                  console.log("Error from fetching token :" + error);
                  reject(error);
                } else {
                  console.log("\nResponse from Fetch CSRF token:" + JSON.stringify(response));
                  let csrftoken = response.headers["x-csrf-token"];
                  console.log("\nToken Reponse is : ---- >" + csrftoken);
                  request.post({
                    url: url,
                    // auth: {
                    //   user: '',
                    //   password: ''
                    // },
                    jar: cookieJar,
                    // headers: {
                    //   "Authorization": "Basic USERANDPWINBASE64",
                    //   "Content-Type": "application/json",
                    //   "X-CSRF-Token": csrftoken
                    // },
                    headers: {
                      "Authorization": "Bearer " + accessToken,
                      "Content-Type": "application/json",
                      "X-CSRF-Token": csrftoken
                    },
                    body: data,
                    json: true
                  }, function (error, response, body) {
                    if (error) {
                      console.log("Error is :" + error);
                      reject(error);
                    }
                    if (response) {
                      //console.log("Reponse is :"+JSON.stringify(response));
                    }
                    if (body) {
                      console.log("Body after executing SAP Call :" + JSON.stringify(body));
                      resolve(body);
                    }
                  });
                }
              });
          }
        }
      ); // close post method
    }
  ) // close promise
};

module.exports = getDataFromBackcend;