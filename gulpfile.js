const
    gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    destination = './build/css/',
    styles = ['./assets/css/custom.sass', './assets/css/piodjio.css'];

gulp.task('connect', function () {
    connect.server({
        root: './',
        port: 8001,
        livereload: true
    });
});

gulp.task('open', function () {
    gulp.src('./index.html')
        .pipe(open({uri: 'http://localhost:8001/'}));
});

gulp.task('html', function () {
    return gulp.src('./*.html')
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
})

gulp.task('css-prod', () => {
    return gulp.src(styles)
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(destination))
        .pipe(connect.reload());
})

gulp.task('watch', () => {
    gulp.watch('./*.html', gulp.series('html'))
    gulp.watch(styles, gulp.series('css-prod'))
})

gulp.task('images', () => {
    return gulp.src('./assets/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/assets/img'))
})

gulp.task('default', gulp.parallel('html', 'css-prod', 'watch', 'images', 'connect', 'open'))
