const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    // Mailchimp API details
    var url = 'https://us10.api.mailchimp.com/3.0/lists/cc8bd15ddd';

    // Payload
    var data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
    var options = { 
        method: 'POST',
        auth: 'anystring:4d3d30a1c10caf8b43fdb178bc5762ba-us10'
    };

    var request = https.request(url, options, function(response) {
        response.on('data', function(d) {
            console.log(JSON.parse(d));

            if (response.statusCode === 200) {
                res.sendFile(__dirname + '/success.html');
            } else {
                res.sendFile(__dirname + '/failure.html');
            }
        });
    });

    app.post('/failure', function(req, res) {
        res.redirect('/');
    });

    request.write(jsonData);
    request.end();

    console.log(res.statusCode);
});


app.listen(process.env.PORT || 3000, function() {
    console.log('Server is running on port 3000.')
});
