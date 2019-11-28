const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const imagemin = require('gulp-imagemin');

const srcJS = './js';
const srcCSS = './assets/css';
const destination = './build';

gulp.task('css-dev', function () {
    return gulp.src(['./assets/css/custom.scss', './assets/css/piodjio.css'])
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest(destination + '/css/'));
});

gulp.task('css-prod', function () {
    return gulp.src(srcCSS + '/custom.scss')
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(destination + '/css/'));
});

gulp.task('watch:css', () => {
    gulp.watch(['./assets/css/custom.scss', './assets/css/piodjio.css'], gulp.series('css-prod'));
});

gulp.task('images', function(){
    return gulp.src('./assets/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/assets/img'))
});

/*let browsersync = false;
gulp.task('default', () => {
    if (browsersync === false) {
        browsersync = require('browser-sync').create();
        browsersync.init({
            server: {
                baseDir: "./"
            }
        });
    }
});*/

gulp.task('default', gulp.parallel('watch:css','images'));
