"use strict";

const { gulp, watch, series, src, dest} = require('gulp');
const sass = require('gulp-sass')(require('sass'));

const scssOptions = {
    errLogToConsole: true,
    style: 'compressed'
};

function scssMain() {

    return src('src/assets/scss/*.scss')
        .pipe(sass(scssOptions))
        .pipe(dest('src/assets/css/'));
}

function scssComponents() {

    return src('src/assets/scss/components/*.scss')
        .pipe(sass(scssOptions))
        .pipe(dest('src/assets/css/components/'));
}

function scssViews() {

    return src('src/assets/scss/views/*.scss')
        .pipe(sass(scssOptions))
        .pipe(dest('src/assets/css/views/'));
}

function scssCompile() {

    series(scssMain, scssComponents, scssViews);
    watch('src/assets/scss/**/*.scss', series(scssMain, scssComponents, scssViews));
}

// Watch task
exports.default = series(scssCompile);
