var gulp = require('gulp');

var browserSync = require('browser-sync');
var cleancss = require('gulp-clean-css');
var include = require('gulp-include');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var util = require('gulp-util');


gulp.task('bundlejs', function () {
  return gulp.src('src/js/_main.js')
    .pipe(include())
      .on('error', console.log)
    .pipe(rename('jquery.scrolling-tabs.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', function () {
  return gulp.src('dist/jquery.scrolling-tabs.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function () {
  return gulp.src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('minjs', function () {
  return gulp.src('dist/jquery.scrolling-tabs.js')
    .pipe(rename('jquery.scrolling-tabs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('mincss', function () {
  return gulp.src('dist/jquery.scrolling-tabs.css')
    .pipe(rename('jquery.scrolling-tabs.min.css'))
    .pipe(cleancss())
    .pipe(gulp.dest('dist'));
});

gulp.task('browser-sync', function () {
  browserSync.init({
    startPath: 'run',
    server: {
      baseDir: './'
    }
  });

  gulp.watch(['dist/*.*', 'test/*.html']).on('change', browserSync.reload);
});

gulp.task('watch', function () {
  gulp.watch('src/scss/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['bundlejs', 'minjs']);
});

gulp.task('default', ['bundlejs', 'lint', 'sass', 'minjs', 'mincss', 'browser-sync', 'watch']);
