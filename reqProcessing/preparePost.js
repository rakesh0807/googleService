const request = require("request");
const http = require("http");

let url = "http://ln04ca.homedepot1.com:8002/sap/opu/odata/sap/ZCAM_GTEST_SRV/WebHookReqSet?sap-client=500"
let fetchurl = "http://ln04ca.homedepot1.com:8002/sap/opu/odata/sap/ZCAM_GTEST_SRV/$metadata?sap-client=500"

var getDataFromBackcend = function (data) {
  return new Promise(function (resolve, reject) {
    var cookieJar = request.jar();
    request.get({
      url: fetchurl, auth: {
        user: 'GXR8193',
        password: 'Search@home1'
      },
      jar: cookieJar,
      headers: {
        "Authorization": "Basic USERANDPWINBASE64",
        "X-CSRF-Token": "Fetch"
      },
    }, function (error, response, body) {
      if (error) {
        console.log("Error from fetching token :" + error);
        reject(error);
      } else {

        let csrftoken = response.headers["x-csrf-token"];
        console.log("Token Reponse is : ---- >" + csrftoken);
        request.post({
          url: url,
          auth: {
            user: 'GXR8193',
            password: 'Search@home1'
          },
          jar: cookieJar,
          headers: {
            "Authorization": "Basic USERANDPWINBASE64",
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
            console.log("Body after executing SAP Call :" + error);
            resolve(body);
          }
        });
      }
    });
  });
}

module.exports = getDataFromBackcend;