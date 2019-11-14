const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const srcJS = './js';
const srcCSS = './css';
const destination = './src';

gulp.task('css-dev', function () {
    return gulp.src(srcCSS + '/css_framework/sass/main.scss')
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions', '> 2%']
        }))
        .pipe(gulp.dest(destination + '/assets/css/'));
});

gulp.task('css-prod', function () {
    return gulp.src(srcCSS + '/css_framework/sass/main.scss')
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions', '> 2%']
        }))
        .pipe(plugins.csso())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(destination + '/assets/css/'));
});