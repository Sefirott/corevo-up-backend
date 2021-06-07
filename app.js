const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('@routes/index');
const campusesRouter = require('@routes/campuses');
const buildingsRouter = require('@routes/buildings');
const floorsRouter = require('@routes/floors');
const linesRouter = require('@routes/lines');
const devicesRouter = require('@routes/devices');
const plcParamsRouter = require('@routes/plcParams');
const tagsRouter = require('@routes/tags');
const sensorsRouter = require('@routes/sensors');
const formulasRouter = require('@routes/formulas');
const screensRouter = require('@routes/screens');
const eventsRouter = require('@routes/events');
const profilesRouter = require('@routes/profiles');

const app = express();

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(logger('dev'));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/campuses', campusesRouter);
app.use('/buildings', buildingsRouter);
app.use('/floors', floorsRouter);
app.use('/lines', linesRouter);
app.use('/devices', devicesRouter);
app.use('/plcParams', plcParamsRouter);
app.use('/tags', tagsRouter);
app.use('/sensors', sensorsRouter);
app.use('/formulas', formulasRouter);
app.use('/screens', screensRouter);
app.use('/events', eventsRouter);
app.use('/profiles', profilesRouter);

module.exports = app;
