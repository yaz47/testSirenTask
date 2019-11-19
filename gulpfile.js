'use strict';

const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');

const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const del = require('del');
const concat = require('gulp-concat');

const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const pug = require('gulp-pug');
const prettyHtml = require('gulp-pretty-html');
const htmlmin = require('gulp-htmlmin');

const browserSync = require('browser-sync').create();

function optimizeImages() {
  return src([
      'source/img/content/*.{png,jpg,svg}',
      'source/img/background/*.{png,jpg,svg}',
      'source/img/pixel-glass/*.{png,jpg,svg}',
      '!source/img/exclude-*/**'
    ])
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(dest('build/img'));
}

function createSourceImages() {
  return src('source/img/exclude-original/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(dest('source/img'));
}

function createWebp() {
  return src('source/img/content/**/*.{png,jpg}')
    .pipe(webp({ quality: 90 }))
    .pipe(dest('build/img'));
}

function cleanBuild() {
  return del('build');
}

function copyBuild() {
  return src([
      'source/fonts/**/*.{woff,woff2}',
      'source/*.ico'
    ], {
      base: 'source'
    })
    .pipe(dest('build'));
}

function createBuildCss() {
  return src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream());
}

function createSourceCss() {
  return src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: true
    }))
    .pipe(rename('style.css'))
    .pipe(dest('source/css'));
}

function createBuildJs() {
  return src([
      'source/js/polyfill.js',
      'source/js/picturefill.min.js',
      'source/js/pixelglass.min.js',
      'source/js/utils.js'
    ])
    .pipe(sourcemap.init())
    .pipe(concat('script.min.js'))
    .pipe(babel())
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(sourcemap.write('.'))
    .pipe(dest('build/js'));
}

function createSvgSprite() {
  return src([
      'source/img/svg-sprite/*.svg',
      '!source/img/svg-sprite/sprite.svg'
    ])
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(dest('source/img/svg-sprite'));
}

function createBuildHtml() {
  return src('source/pug/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('build'));
}

function createSourceHtml() {
  return src('source/pug/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(prettyHtml({
      indent_size: 2,
      indent_char: ' ',
      unformatted: ['code', 'em', 'strong', 'span', 'i', 'b', 'br'],
      content_unformatted: []
    }))
    .pipe(dest('source/html'));
}

function refreshServer(done) {
  browserSync.reload();
  done();
}

function initServer() {
  browserSync.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  watch([
    'source/sass/**/*.{scss,sass}',
    'source/blocks/**/*.{scss,sass}'
  ], series(createBuildCss, createSourceCss));
  watch('source/img/exclude-original/**',
    series(exports.build, refreshServer));
  watch('source/js/**/*.js',
    series(exports.js, refreshServer));
  watch('source/img/exclude-sprite/**/*.svg',
    series(createSvgSprite, createBuildHtml, createSourceHtml, refreshServer));
  watch([
    'source/pug/**/*.pug',
    'source/blocks/**/*.pug'
  ], series(createBuildHtml, createSourceHtml, refreshServer));
}

exports.createSourceImages = createSourceImages;
exports.images = series(optimizeImages, createWebp);
exports.js = createBuildJs;
exports.build = series(
  cleanBuild, copyBuild, exports.images,
  parallel(series(createBuildCss, createSourceCss), createSvgSprite, exports.js),
  createBuildHtml, createSourceHtml
);
exports.start = series(exports.build, initServer);
exports.initServer = initServer;
