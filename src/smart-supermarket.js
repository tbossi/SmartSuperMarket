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
    constructor() {
        this.app = express();
        this.setViewEngine();
        this.setOthers();
        this.setRoutes();
    }

    toExpressApp(port) {
        this.app.set('port', port);
        return this.app;
    }

    setViewEngine() {
        this.app.set('views', viewDir);
        this.app.set('view engine', 'pug');
    }

    setOthers() {
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(sassMiddleware({
            src: publicDir,
            dest: publicDir,
            indentedSyntax: false, // true = .sass and false = .scss
            sourceMap: true
        }));
    }

    setRoutes() {
        this.app.use(express.static(publicDir));

        this.app.use('/', indexRouter);
        this.app.use('/users', usersRouter);

        this.app.use(function(req, res, next) {
            next(createError(404));
        });

        this.app.use(function(err, req, res, next) {
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