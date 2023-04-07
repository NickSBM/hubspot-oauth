//required installed modules
console.log('running server script')
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const crypt =require('crypto');  //used to validate HubSpot request
const querystring = require('querystring');
const PORT = 3001 || process.env.PORT

//declare custom modules
const hsOauth = require('./hubspot-oauth');

 //declare variables from modules
const app = express();  //used to start web app

//Endpoints
//oath-callback:  Used in the Oath validation process to 
app.get('/oath-callback', async(req, res) => {
    
    //verify code is included
    if (req.query.code) {
        try {
            console.log("Attempting to generate new token");
            token = await hsOauth.newToken(req.query.code);
        }
        catch (err) {
            console.log('Error caught in getting OAuth token: ' + err);
            return res.redirect('/error?msg=Error%20Authorizing%20App');
        }
    }

    
    console.log('access token = ' + token.access_token);
    res.redirect('/readme');
    

}); 

//Error page
app.get('/error', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write(`<h4>Error:  ${req.query.msg}`);
    res.end();
});

app.get('/readme', (req, res) => {
    res.setHeader('Content-Type','text/html');
    res.write('<h4>Congrats, the app is installed</h4>');
    res.end();
});
app.get('/', (req,res) => {
    res.send('Hello from our smartbug oauth app')
})

//Listner
app.listen(PORT, () => console.log('listening on ' + PORT));






