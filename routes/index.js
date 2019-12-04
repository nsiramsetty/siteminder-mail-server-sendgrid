let express = require('express');
let router = express.Router();
let request = require('request');
const SENDGRID_CONFIG = require('../config/sendgrid.config');

router.post('/send', function (req, res) {
    let apiBaseUrl = SENDGRID_CONFIG.baseURL;
    let apiKey = SENDGRID_CONFIG.apiKey;
    let from = SENDGRID_CONFIG.fromAddress;
    if (!req || !req.body || !req.body.to || req.body.to.length === 0) {
        res.status(404).send({
            "statusCode": 400,
            "body": 'Bad Request.'
        });
    } else {
        let personalizations = {};
        personalizations.to = [];
        req.body.to.forEach((email)=>{
            personalizations.to.push({
                "email" : email
            });
        });
        if(req.body.cc && req.body.cc.length > 0){
            personalizations.cc = [];
            req.body.cc.forEach((email)=>{
                personalizations.cc.push({
                    "email" : email
                });
            });
        }
        if(req.body.bcc && req.body.bcc.length > 0){
            personalizations.bcc = [];
            req.body.bcc.forEach((email)=>{
                personalizations.bcc.push({
                    "email" : email
                });
            });
        }
        let body = {
            "personalizations" : [personalizations],
            "from": {
                "email": from
            },
            "subject": req.body.subject,
            "content": [
                {
                    "type": "text/plain",
                    "value": req.body.text
                }
            ]
        };
        let sendGridOpts = {
            url: apiBaseUrl + '/mail/send',
            headers: {
                Authorization: 'Bearer ' + apiKey,
                "Content-Type" : 'application/json'
            },
            body: JSON.stringify(body)
        };
        request.post(sendGridOpts, function (err, response) {
            res.status(response.statusCode).send(response);
        });
    }
});

router.get('/*', function (req, res, next) {
    res.status(404).send({
        "statusCode": 404,
        "body": 'Page Not Found.'
    })
});

module.exports = router;