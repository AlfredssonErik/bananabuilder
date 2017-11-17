/****
Created By Erik Alfredsson
This script compiles javascript and less files and runs a live reload as well as a production build, this is
a basic gulp boilerplate, feel free to add your own scripts.

If you have any problems, make sure to follow these steps:
1. Install npm
2. Run 'npm install gulp -g'
3. Run 'npm install' in the root folder with
this structure (Dont forget the preconfigured package.json file
that contains the necessary dependencies.)

|- dist/
  |- css/
  |- js/
  |- index.html
|- less/
|- script/
|- gulpfile.js
|- node_modules/
|- package.json

The following commands are available:

To start a live reload of your working files:
gulp watch

To run the build without live reload:
gulp build

Add '--prod' to build a production version without sourcemaps and extra minification
gulp build --prod

****/

var gulp = require('gulp');
var gulpif = require('gulp-if');
var util = require('gulp-util');
var del = require('del');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var cleancss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');

// Configuration
var config = {
    prod: !util.env.prod
};

// Compile less files
gulp.task('less', function() {
    return gulp.src('less/main.less')
        .pipe(gulpif(config.prod, sourcemaps.init()))
        .pipe(less()) 
        .pipe(autoprefixer()) 
        .pipe(plumber(function(err){
            onError(err);
        }))
        .pipe(cleancss())
        .pipe(gulpif(config.prod, sourcemaps.write('./maps')))
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.reload({
            stream: true
        }));

});

// Compile script files
gulp.task('script', function (cb) {
        return gulp.src('script/*.js')
        .pipe(plumber(function(err){
            onError(err);
        }))
        .pipe(gulpif(config.prod, sourcemaps.init()))
        .pipe(concat('script.js'))
        .pipe(gulpif(config.prod, uglify()))
        .pipe(gulpif(config.prod, sourcemaps.write('./maps')))
        .pipe(gulp.dest('dist/js/'));    
});

// Browsersync
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    });
});

// Error handling
var onError = function (err) {
    notify({
        title: 'Gulp Task Error',
        message: 'Check the console.',
        sound: true
    }).write(err);
    console.log(err.toString());
};

// Clean
gulp.task('clean', function() {
    return del([
        'dist/css/**/*',
        'dist/js/**/*'
      ]);
});

// Build once
gulp.task('build', function() {
    runSequence(
        'clean',
        ['less','script']
    );
});

// Start the watch task to watch files for changes.
// The second argument with an array is to run certain tasks before 'watch'.
// In this case to first start browser-sync and run the "less task"
// to generate the css file before watching for additional changes.
gulp.task('watch', ['browserSync', 'less', 'script'], function() {
    // Run the sass task whenever SCSS files change
    gulp.watch('less/**/*.less', ['less']);
    // Run the Script task whenever Javascript files change
    gulp.watch('script/**/*.js', ['script']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('dist/*.html', browserSync.reload);
    gulp.watch('dist/js/**/*.js', browserSync.reload);
});
