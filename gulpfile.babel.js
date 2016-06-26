'use strict';

import gulp from 'gulp';
import config from './gulp.config'
import log from './log'
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
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import cheerio from 'gulp-cheerio';
import mdcss from 'mdcss';
import gulpLoadPlugins from 'gulp-load-plugins';

var plugins = gulpLoadPlugins();


function onError(err) {
  log(err);
  this.emit('end');
}

gulp.task('css', () => {
  gulp.src(config.source.styl)
    .pipe(stylus({
      use: [rupture(), poststylus([lost(), fontMagician(), rucksack({ autoprefixer: true })])],
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
    .pipe(gulp.dest(config.build.css));
});

gulp.task('vendors', () => {
  gulp.src(config.source.vendors)
    .pipe(plumber())
    .pipe(concat('vendors.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.build.vendors));
});

gulp.task('js', () => {
  gulp.src(config.source.js)
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .on('error', onError)
    .pipe(gulp.dest(config.build.js));
});

gulp.task('html', () => {
  gulp.src(config.source.html)
    .pipe(plumber())
    .pipe(pug())
    .on('error', onError)
    .pipe(gulp.dest(config.build.html));
});

gulp.task('images', () => {
  gulp.src(config.source.img)
    .pipe(plumber())
    .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      }))
    .pipe(gulp.dest(config.build.img));
});

gulp.task('icons', () => {
  gulp.src(config.source.icons)
    .pipe(svgmin())
    .pipe(svgstore({ fileName: 'icons.svg', inlineSvg: true }))
    .pipe(cheerio({
      run: function ($, file) {
          $('svg').addClass('hide');
          $('[fill]').removeAttr('fill');
        },

      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest(config.build.svg));
});

gulp.task('watch', () => {
  gulp.watch(config.source.html, { debounceDelay: 300 }, ['html']);
  gulp.watch(config.source.css, ['css']);
  gulp.watch(config.source.js, ['js']);
  gulp.watch(config.source.img, ['images']);
  gulp.watch(config.source.icons, ['icons']);
});

gulp.task('browser-sync', () => {
  var files = [
    config.build.build
  ];

  browserSync.init(files, {
    server: {
      baseDir: './build/'
    },
  });

});

gulp.task('default', ['css', 'html', 'vendors', 'js', 'images', 'icons', 'watch', 'browser-sync']);
gulp.task('build', ['css', 'html', 'vendors', 'js', 'images', 'icons']);

