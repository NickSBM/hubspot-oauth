const axios = require('axios');
const queryString = require('querystring');


///////////////////////////////////////////////////////////////////////////////
// oath.js
//  Use:  Includes OAuth authentication functions for HubSpot
//  
//  Date:
//  Change log:
//
///////////////////////////////////////////////////////////////////////////////

//Constants
const redirectURI = '44.212.63.1:3001/oath-callback';  //This should probably be an environment var
const authURL = 'https://api.hubapi.com/oauth/v1/token';

//getNewToken
//Input:  HubSpot code (required)
//Output:  OAuth token object
const getNewToken = (oauthCode) => {
    //return a promise so you can use async/await if needed
    return new Promise(async (token) => {
        if (oauthCode === null) {
            //Throw error, code is required
            const err = new Error('HubSpot code is missing');
            throw err;
        }

        var responseToken = {};
        //var url = authURL + '&code=' + oauthCode;

        var config = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
            responseType: 'blob'
        };
        
        //Used to get authorization code
        const formData = {
            grant_type: 'authorization_code',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: redirectURI,
            code: oauthCode
        };

        const data = queryString.stringify(formData);

        console.log('Calling OAuth for token');
        await axios.post(authURL, data, config)
        .then(function (response) {
            responseToken = response.data;
        })
        .catch(function (error) {
            console.log('Error in calling OAuth: ' + error);
            console.log(error.response);
            throw error;
        });
        
        token(responseToken);
    });
}   

//refreshToken
//Input:  oathToken which is the refresh token from the original call (required)
//Output:  new Oauth token object
const refreshToken = (oathToken) => {
    //return a promise so you can use async/await if needed
    return new Promise(async (token) => {
        if (oauthToken === null) {
            //Throw error, code is required
            const err = new Error('HubSpot code is missing');
            throw err;
        }

        //Header configuration
        var config = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            responseType: 'blob'
        };

        //Used to get authorization code
        var formData = {
            grant_type: 'refresh_token',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: redirectURI,
            refresh_token: oauthToken
        };

        var responseToken = {};

        console.log('Calling OAuth for token');
        await axios.post(url, {form: formData}, config)
        .then(function (response) {
            responseToken = response.data;
        })
        .catch(function (error) {
            console.log('Error in calling OAuth: ' + error);
            throw error;
        });
        
        token(responseToken);
    });
} 

module.exports.refreshToken = refreshToken;
module.exports.newToken = getNewToken;