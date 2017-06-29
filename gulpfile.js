const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserify = require('gulp-browserify');
const del = require('del');

let sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
}

gulp.task('clean', function() {
  del(['dist'], {force: true});
});

gulp.task('html', function() {
    return gulp.src("./app/**/*.html")
        .pipe(gulp.dest("./dist"))
        .pipe(browserSync.stream());
});

gulp.task('scss', function() {
    return gulp.src("./app/scss/**/*.scss")
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src('./app/js/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(browserify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('watch', ['clean', 'html', 'scss', 'js'], function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch("./app/**/*.html", ['html']).on('change', browserSync.reload);
    gulp.watch("./app/scss/**/*.scss", ['scss']).on('change', browserSync.reload);
    gulp.watch("./app/js/**/*.js", ['js-watch']);
});

gulp.task('default', ['clean', 'html', 'scss', 'js']);
