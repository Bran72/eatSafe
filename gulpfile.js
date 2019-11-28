const
    gulp = require( 'gulp' ),
    plugins = require( 'gulp-load-plugins' )(),
    imagemin = require( 'gulp-imagemin' ),
    destination = './build/css/',
    styles = ['./assets/css/custom.scss', './assets/css/piodjio.css']

gulp.task( 'css-prod', () => {
    return gulp.src( styles )
        .pipe( plugins.sass() )
        .pipe( plugins.autoprefixer() )
        .pipe( plugins.rename( {
            suffix: '.min'
        } ) )
        .pipe( gulp.dest( destination ) )
} )

gulp.task( 'watch:css', () => {
    gulp.watch( styles, gulp.series( 'css-prod' ) )
} )

gulp.task( 'images', () => {
    return gulp.src( './assets/img/*' )
        .pipe( imagemin() )
        .pipe( gulp.dest( './build/assets/img' ) )
} )

gulp.task( 'default', gulp.parallel( 'css-prod', 'watch:css', 'images' ) )
