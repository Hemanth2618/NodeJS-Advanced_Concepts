const express = require('express');
const config = require('config')
const logger = require('./logger')
const Joi = require('joi');
const helmet = require('helmet')
const morgan = require('morgan')
const app = express();

// Setting the template engine
app.set('view engine', 'pug'); // By default, all the templates will be stored in views directory in root of application

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny'));
app.use(logger);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Configuration
console.log('Application name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));


app.use((req, res, next) => {
    console.log("Authenticating...");
    next();
});

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
]

app.get('/', (req, res) => {
    res.render('index', {title: "My Express App", message: "Hello"});
});

app.get('/api/courses/', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {

    const {error} = validateCourse(req.body);
    if (error) return res.status(400).send(error);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    const course = (courses.find(c => c.id === parseInt(req.params.id)));
    if (!course) return res.status(404).send('The course with given ID was not found');

    // Validate the Input
    const {error} = validateCourse(req.body);
    if (error) return res.status(400).send(error);

    // Update the course
    course.name = req.body.name;
    res.send(course)
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return schema.validate(course);
}

app.get('/api/courses/:id', (req, res) => {
    const course = (courses.find(c => c.id === parseInt(req.params.id)));
    if (!course) return res.status(404).send('The course with given ID was not found');
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    const course = (courses.find(c => c.id === parseInt(req.params.id)));
    if (!course) return res.status(404).send('The course with given ID was not found');

    // Delete the course
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);

})

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));