var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var imagemin = require("gulp-imagemin");
var rename = require("gulp-rename");
var posthtml = require("gulp-posthtml");
var del = require("del");
var minify = require("gulp-csso");

gulp.task ("images", function () {
  return gulp.src("source/img/*.jpg")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("style", function() {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("serve", function() {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{sass,scss}", gulp.series("style"));
  gulp.watch("source/*.html").on("change", server.reload);
});

  gulp.task("start", gulp.series("style", "serve"));
