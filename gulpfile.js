'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const stylus = require('gulp-stylus');
const poststylus = require('poststylus');
const rucksack = require('rucksack-css');
const fontMagician = require('postcss-font-magician');
const gcmq = require('gulp-group-css-media-queries');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const lost = require('lost');
const rupture = require('rupture');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const pug = require('gulp-pug');
const data = require('gulp-data');
const yaml = require('js-yaml');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const cheerio = require('gulp-cheerio');
const mdcss = require('mdcss');
const fs = require('fs');

const srcPaths = {
  js: 'src/js/**/*.js',
  css: 'src/styl/**/*.styl',
  styl: 'src/styl/style.styl',
  html: 'src/pug/*.pug',
  icons: 'src/svg/icons/*',
  svg: 'src/svg/',
  img: 'src/img/**/*',
  data: 'src/data/',
  vendors: [

  ]
};

const buildPaths = {
  build: 'build/**/*',
  js: 'build/js/',
  css: 'build/css/',
  html: 'build/',
  img: 'build/img',
  svg: 'build/svg',
  vendors: 'src/js/_core/'
};

let dataJson = {}
let files = []

gulp.task('css', () => {
  gulp.src(srcPaths.styl)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus({
      use: [
        rupture(),
        poststylus([
          lost(),
          fontMagician(),
          rucksack({
            autoprefixer: true
          })
        ])
      ],
      compress: false
    }))
    .pipe(gcmq())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(buildPaths.css));
});

gulp.task('styleguide', () => {
  gulp.src(srcApp.styl)
    .pipe(plumber())
    .pipe(stylus({
      use: [
        rupture(),
        poststylus([
          lost(),
          fontMagician(),
          rucksack({
            autoprefixer: true
          })
        ])
      ],
      compress: false
    }))
    .pipe(postcss([
      mdcss({
        //logo: '',
        destination: 'public/styleguide',
        title: 'Styleguide',
        examples: {
          css: ['../css/style.css']
        },
      })
    ]));
});

gulp.task('vendors', () => {
  gulp.src(srcPaths.vendors)
    .pipe(plumber())
    .pipe(concat('vendors.js'))
    .pipe(uglify())
    .pipe(gulp.dest(buildPaths.vendors));
});

gulp.task('js', () => {
  gulp.src(srcPaths.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({ compact: false }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(buildPaths.js));
});

gulp.task('read:data', () => {
  fs.readdir(srcPaths.data, (err, items) => {
    for (var i = 0; i < items.length; i++) {
      files.push(items[i].split('.')[0]);
    }
    for (var i = 0; i < files.length; i++) {
      dataJson[files[i]] = yaml.safeLoad(fs.readFileSync(srcPaths.data + '/' + files[i] + '.yml', 'utf-8'));
    }
  });
});

gulp.task('html', () => {
  gulp.src(srcPaths.html)
    .pipe(plumber())
    .pipe(data(dataJson))
    .pipe(pug())
    .pipe(gulp.dest(buildPaths.html));
});

gulp.task('images', () => {
  gulp.src(srcPaths.img)
    .pipe(plumber())
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(buildPaths.img));
});

gulp.task('svg', () => {
  gulp.src(srcPaths.svg)
    .pipe(svgmin())
    .pipe(gulp.dest(srcPaths.svg));
  gulp.src(srcPaths.svg)
    .pipe(svgmin())
    .pipe(gulp.dest(buildPaths.svg));
});

gulp.task('icons', () => {
  gulp.src(srcPaths.icons)
    .pipe(svgmin())
    .pipe(svgstore({ fileName: 'icons.svg', inlineSvg: true }))
    .pipe(cheerio({
      run: function($, file) {
        $('svg').addClass('hide');
        $('[fill]').removeAttr('fill');
      },

      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest(buildPaths.svg));
});

gulp.task('watch', () => {
  gulp.watch(srcPaths.html, { debounceDelay: 300 }, ['html']);
  gulp.watch(srcPaths.data + '**/*', { debounceDelay: 300 }, ['read:data', 'html']);
  gulp.watch(srcPaths.css, ['css']);
  gulp.watch(srcPaths.js, ['js']);
  gulp.watch(srcPaths.img, ['images']);
  gulp.watch(srcPaths.icons, ['icons']);
});

gulp.task('browser-sync', () => {
  var files = [
    buildPaths.build
  ];

  browserSync.init(files, {
    server: {
      baseDir: './build/'
    },
  });

});

gulp.task('build', [
  'css',
  'read:data',
  'html',
  'vendors',
  'js',
  'images',
  'svg',
  'icons'
]);

gulp.task('default', [
  'build',
  'watch',
  'browser-sync'
]);
