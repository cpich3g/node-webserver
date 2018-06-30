const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();
const port = process.env.PORT || 3001;
var maintenanceMode = 0;
var currentTime = `${new Date().getHours()}:${new Date().getMinutes()}`;


hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

if (maintenanceMode === 1) {
    app.use((req, res) => {
        res.render('maintenance.hbs', {
            pageTitle: `We'll be back shortly`
        });
    });    
}

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase()
});

app.get('/', (req, res) => {
    // res.send('<h1> Hello Express! </h1>');
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: `Welcome! `,
        currentTime: `Server Time: ${currentTime}`
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Project Page'
    });
});


app.get('/bad', (req, res) => {
    res.send({
        error: 404,
        errorMessage: 'Unable to handle request',
        errorProperties: {
            description: 'Page not found',
            returnLink: 'Visit *:3000 instead'
        }
    });
});
app.listen(port, () => {
    console.log(`Server is up on port: ${port}`);
});