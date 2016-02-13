var browserify = require("gulp-browserify");
var gulp = require("gulp");
var gutil = require("gulp-util");
var rename = require("gulp-rename");

gulp.task("requerify", function() {
	gulp.src("./app/app.js")
		.pipe(browserify())
		.pipe(rename("bundle.js"))
		.pipe(gulp.dest("./app"));
});

gulp.task('watch', function() {
	gulp.watch('./app/app.js', ['requerify']);
});

gulp.task("default",['watch']);