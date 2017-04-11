'use strict';

import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import livereload from 'gulp-livereload';
import less from 'gulp-less';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';

const config = {
    //babel
    jsSrc: './app/js/app.js',
    jsWatch: './app/js/**/*.js',
    jsMap: './maps',
    jsBundle: 'bundle.js',
    jsDest: './public/js',
    //less
    lessSrc: './app/less/app.less',
    lessWatch: './app/less/**/*.less',
    lessDest: './public/css/',
    //fonts
    fontsSrc: './app/less/fonts/**',
    fontsWatch: './app/less/fonts/**',
    fontsDest: './public/css/fonts/',
    //browser.html
    browserHtmlSrc: './app/browser.html',
    browserHtmlWatch: './app/browser.html',
    browserHtmlDest: './public/',
    //bower_components
    bowerComponentsSrc: './app/bower_components/**',
    bowerComponentsWatch: './app/bower_components/**',
    bowerComponentsDest: './public/bower_components/'
};

function swallowError(error) {
    // If you want details of the error in the console
    console.log(error.toString());
    this.emit('end'); // jshint ignore:line
}

gulp.task('build-babel', () => {
    return browserify({
            entries: [config.jsSrc],
            debug: true
        })
        .transform(babelify.configure({
            ignore: /(bower_components)|(node_modules)/
        }), {
            presets: ['es2015']
        })
        .bundle()
        .on('error', swallowError)
        .pipe(plumber(swallowError))
        .pipe(source(config.jsBundle))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write(config.jsMap))
        .pipe(gulp.dest(config.jsDest))
        .pipe(livereload());
});

// Compiles LESS > CSS
gulp.task('build-less', function() {
    return gulp.src(config.lessSrc)
        .pipe(plumber(swallowError))
        .pipe(less())
        .pipe(gulp.dest(config.lessDest))
        .pipe(livereload());
});

gulp.task('copy-fonts', function() {
    return gulp.src(config.fontsSrc)
        .pipe(gulp.dest(config.fontsDest));
});

gulp.task('copy-browser-html', function() {
    return gulp.src(config.browserHtmlSrc)
        .pipe(rename('index.html'))
        .pipe(gulp.dest(config.browserHtmlDest));
});

gulp.task('copy-bower-components', function() {
    return gulp.src(config.bowerComponentsSrc)
        .pipe(gulp.dest(config.bowerComponentsDest));
});

gulp.task('build', ['build-babel', 'build-less', 'copy-fonts', 'copy-browser-html', 'copy-bower-components']);

gulp.task('watch', ['build'], () => {
    livereload.listen();
    gulp.watch(config.jsWatch, ['build-babel']);
    gulp.watch(config.lessWatch, ['build-less']);
    gulp.watch(config.fontsWatch, ['copy-fonts']);
    gulp.watch(config.browserHtmlWatch, ['copy-browser-html']);
    gulp.watch(config.bowerComponentsWatch, ['copy-bower-components']);
});

gulp.task('default', ['build']);
