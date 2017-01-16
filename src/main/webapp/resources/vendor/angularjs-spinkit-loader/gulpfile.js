var ngHtml2Js = require("gulp-ng-html2js");
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del');

gulp.task('html', function() {
	return gulp.src("./partials/*.html")
	.pipe(ngHtml2Js({
		moduleName: "Gdo"
	}))
	.pipe(concat("partials.min.js"))
	.pipe(uglify())
	.pipe(gulp.dest("./tmp/js"));
});

gulp.task('js', function() {
  return gulp.src([
    './src/spinkit-loader.js',
  ])
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('./tmp/js'))
});

gulp.task('concat', ['js', 'html'], function() {
  return gulp.src(['./tmp/js/*.js'])
    .pipe(concat('spinkit-loader.min.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  gulp.watch('./src/*.js', ['concat']);
  gulp.watch('./partials/*.html', ['concat']);
});

gulp.task('clean', function(cb) {
  del(['./dist/*.js', './tmp/js/*.js'], cb())
});

gulp.task('default', ['clean'], function() {
    gulp.start('concat', 'watch');
});