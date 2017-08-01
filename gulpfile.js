var gulp = require('gulp');

var browserSync = require('browser-sync');
var cleancss = require('gulp-clean-css');
var fs = require('fs');
var header = require('gulp-header');
var include = require('gulp-include');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var util = require('gulp-util');

var headerFilePath = 'src/js/header.js';

gulp.task('browser-sync', function () {
  browserSync.init({
    startPath: 'run',
    server: {
      baseDir: './'
    },
    port: 3000,
    ghostMode: false
  });
});

gulp.task('bundlejs', function () {
  return gulp.src('src/js/_main.js')
    .pipe(include())
      .on('error', console.log)
    .pipe(header(fs.readFileSync(headerFilePath, 'utf8')))
    .pipe(rename('jquery.scrolling-tabs.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('lintdist', function () {
  return gulp.src('dist/jquery.scrolling-tabs.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lintsrc', function () {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('minjs', function () {
  return gulp.src('dist/jquery.scrolling-tabs.js')
    .pipe(rename('jquery.scrolling-tabs.min.js'))
    .pipe(uglify())
    .pipe(header(fs.readFileSync(headerFilePath, 'utf8')))
    .pipe(gulp.dest('dist'));
});

gulp.task('mincss', function () {
  return gulp.src('dist/jquery.scrolling-tabs.css')
    .pipe(rename('jquery.scrolling-tabs.min.css'))
    .pipe(cleancss())
    .pipe(header(fs.readFileSync(headerFilePath, 'utf8')))
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  return gulp.src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(header(fs.readFileSync(headerFilePath, 'utf8')))
    .pipe(gulp.dest('dist'));
});


gulp.task('watch', function () {
  gulp.watch('src/scss/*.scss', ['buildcss']);
  gulp.watch('src/js/*.js', ['buildjs', 'buildcss']);
});

gulp.task('buildcss', function (cb) {
  runSequence('sass',
              'mincss',
              cb);
});

gulp.task('buildjs', function (cb) {
  runSequence('lintsrc',
              'bundlejs',
              'lintdist',
              'minjs',
              cb);
});

gulp.task('build', function (cb) {
  runSequence('buildcss',
              'buildjs',
              cb);
});

gulp.task('default', function () {
  runSequence('build',
              'browser-sync',
              'watch');
});
