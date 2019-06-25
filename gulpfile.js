/****
Created By Erik Alfredsson
This script compiles javascript and sass files and runs a live reload as well as a production build, this is
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
|- sass/
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
var soucemaps = require('gulp-sourcemaps');
var mode = require('gulp-mode')({
	modes: ['prod', 'dev'],
	default: 'dev',
	verbose: false
});
var del = require('del');
var log = require('fancy-log');
var chalk = require('chalk');
var sass = require('gulp-sass');
var cssMinify = require('gulp-cssnano');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');


// Compile less files
gulp.task('sass', function() {
	return gulp.src('sass/main.scss')
		.pipe(plumber({errorHandler: onError}))
        .pipe(sass()) 
		.pipe(autoprefixer()) 
		.pipe(mode.prod(cssMinify({
			safe: true
		})))
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.reload({
            stream: true
		})
	);
});

// Compile script files
gulp.task('script', function (cb) {
	return gulp.src('script/*.js')
		.pipe(mode.dev(soucemaps.init()))
		.pipe(plumber({errorHandler: onError}))
		.pipe(concat('script.js'))
		.pipe(mode.dev(soucemaps.write()))
		.pipe(gulp.dest('dist/js/')
	);    
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
	log.error(chalk.redBright(err.message.toString()));
	this.emit('end');
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
        ['sass','script']
    );
});

// Start the watch task to watch files for changes.
// The second argument with an array is to run certain tasks before 'watch'.
// In this case to first start browser-sync and run the "sass task"
// to generate the css file before watching for additional changes.
gulp.task('watch', ['browserSync', 'sass', 'script'], function() {
    // Run the sass task whenever SCSS files change
    gulp.watch('sass/**/*.scss', ['sass']);
    // Run the Script task whenever Javascript files change
    gulp.watch('script/**/*.js', ['script']);
});
