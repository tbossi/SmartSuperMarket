'use strict';
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sassMiddleware = require('node-sass-middleware');
const createError = require('http-errors');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const publicDir = path.join(__dirname, 'public');
const viewDir = path.join(__dirname, 'views');

class smartSupermarket {
    constructor(...devices) {
        this.devices = devices;
    }

    toExpressApp(port) {
        let app = express();
        this.setViewEngine(app);
        this.setOthers(app);
        this.setRoutes(app);
        app.set('port', port);
        return app;
    }

    setViewEngine(app) {
        app.set('views', viewDir);
        app.set('view engine', 'pug');
    }

    setOthers(app) {
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(sassMiddleware({
            src: publicDir,
            dest: publicDir,
            indentedSyntax: false, // true = .sass and false = .scss
            sourceMap: true
        }));
    }

    setRoutes(app) {
        app.use(express.static(publicDir));

        //todo pass this.devices to some controller
        app.use('/', indexRouter);
        app.use('/users', usersRouter);

        app.use(function(req, res, next) {
            next(createError(404));
        });

        app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }
}

module.exports = smartSupermarket;