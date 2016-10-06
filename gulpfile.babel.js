'use strict';

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import stylus from 'gulp-stylus';
import poststylus from 'poststylus';
import rucksack from 'rucksack-css';
import fontMagician from 'postcss-font-magician';
import gcmq from 'gulp-group-css-media-queries';
import cssnano from 'gulp-cssnano';
import sourcemaps from 'gulp-sourcemaps';
import lost from 'lost';
import rupture from 'rupture';
import postcss from 'gulp-postcss';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import pug from 'gulp-pug';
import data from 'gulp-data';
import yaml from 'js-yaml';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import cheerio from 'gulp-cheerio';
import mdcss from 'mdcss';
import fs from 'fs';

const srcPaths = {
  js: 'src/js/**/*.js',
  css: 'src/styl/**/*.styl',
  styl: 'src/styl/style.styl',
  html: 'src/pug/*.pug',
  icons: 'src/svg/icons/*',
  svg: '_src/svg/*.svg', 
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
  svg: 'build/svg/',
  vendors: 'src/js/_core/'
};

let dataJson = {}
let files = []

function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('css', () => {
  gulp.src(srcPaths.styl)
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
    .on('error', onError)
    .pipe(postcss([
      mdcss({
        logo: '../logo-kratos.png',
        examples: {
          css: ['../build/css/style.css']
        }
      })
    ]))
    .on('error', onError)
    .pipe(gcmq())
    .pipe(cssnano())
    .pipe(gulp.dest(buildPaths.css));
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
    .pipe(concat('main.js'))
    .pipe(uglify())
    .on('error', onError)
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
    .on('error', onError)
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
    .pipe(gulp.dest(buildPaths.svg));
});

gulp.task('icons', () => {
  gulp.src(srcPaths.icons)
    .pipe(svgmin())
    .pipe(svgstore({ fileName: 'icons.svg', inlineSvg: true }))
    .pipe(cheerio({
      run: function ($, file) {
          $('svg').addClass('hide');
          $('[fill]').removeAttr('fill');
        },

      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest(buildPaths.svg));
});

gulp.task('watch', () => {
  gulp.watch(srcPaths.html, { debounceDelay: 300 }, ['html']);
  gulp.watch(srcPaths.data+'**/*', { debounceDelay: 300 }, ['read:data','html']);
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
 
gulp.task('default', ['css', 'read:data', 'html', 'vendors', 'js', 'images', 'svg', 'icons', 'watch', 'browser-sync']);
gulp.task('build', ['css', 'read:data', 'html', 'vendors', 'js', 'images', 'svg', 'icons']); 

