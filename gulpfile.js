"use strict";

/****
Created By Erik Alfredsson
This script compiles nunjucks, javascript and sass files and runs a live reload as well as a production build, this is
a basic gulp boilerplate, feel free to add your own scripts.
****/

const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const soucemaps = require('gulp-sourcemaps');
const mode = require('gulp-mode')({
	modes: ['prod', 'dev'],
	default: 'dev',
	verbose: false
});
const del = require('del');
const log = require('fancy-log');
const chalk = require('chalk');
const sass = require('gulp-sass');
const cssMinify = require('gulp-cssnano');
const browsersync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const fs = require('fs');

function nunjucks(){
	return gulp.src('nunjucks/pages/**/*.+(html|nj)')
	.pipe(plumber({errorHandler: onError}))
	.pipe(data(function() {
		return JSON.parse(fs.readFileSync('./nunjucks/data.json'));
	}))
	.pipe(nunjucksRender({
		path: ['nunjucks/templates']
	}))
	.pipe(gulp.dest('dist'));
};


// Compile style files
function styles() {
	return gulp.src('sass/main.scss')
	.pipe(plumber({errorHandler: onError}))
	.pipe(sass()) 
	.pipe(autoprefixer()) 
	.pipe(mode.prod(cssMinify({
		safe: true
	})))
	.pipe(gulp.dest('dist/css/'))
	.pipe(browsersync.stream());
};

// Compile script files
function scripts() {
	return gulp.src('script/*.js')
	.pipe(mode.dev(soucemaps.init()))
	.pipe(plumber({errorHandler: onError}))
	.pipe(concat('script.js'))
	.pipe(mode.dev(soucemaps.write()))
	.pipe(gulp.dest('dist/js/'))
	.pipe(browsersync.stream());
};

// Copy assets
function assets() {
	return gulp.src('assets/**/*')
	.pipe(gulp.dest('dist/assets'))
}

// Browsersync
function browserSync(done) {
	browsersync.init({
        server: {
            baseDir: 'dist'
		}
	});
	done();
}

// Browsersync reload
function browserSyncReload(done) {
	browsersync.reload();
	done();
}

// Error handling
function onError(err) {
	log.error(chalk.redBright(err.message.toString()));
	this.emit('end');
};

// Clean
function clean() {
	return del(['dist/*']);
}

// Start the watch task to watch files for changes.
function watcher() {
	// Run the nunjucks task whenever nunjucks files change
	gulp.watch('nunjucks/**/*.+(html|nj|json)', gulp.series(nunjucks, browserSyncReload));
	// Run the sass task whenever SCSS files change
	gulp.watch('sass/**/*.scss', styles);
	// Run the Script task whenever Javascript files change
	gulp.watch('script/**/*.js', scripts);
}

// export tasks
const build = gulp.series(clean, gulp.parallel(nunjucks, styles));
const watch = gulp.series(gulp.parallel(nunjucks, styles, scripts, assets), gulp.parallel(watcher, browserSync));

exports.nunjucks = nunjucks;
exports.styles = styles;
exports.scripts = scripts;
exports.assets = assets;
exports.onError = onError;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
