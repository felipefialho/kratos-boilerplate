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
import jade from 'gulp-jade';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import cheerio from 'gulp-cheerio';

const srcPaths = {
  js: 'src/js/**/*.js',
  css: 'src/styl/**/*.styl',
  styl: 'src/styl/style.styl',
  jade: 'src/templates/*.jade',
  icons: 'src/svg/icons/*',
  svg: 'src/svg/',
  jade: 'src/jade/*.jade',
  img: 'src/img/**/*',
  vendors: [

  ]
};

const buildPaths = {
  build: 'build/**/*',
  js: 'build/js/',
  css: 'build/css/',
  jade: 'build/',
  img: 'build/img',
  svg: 'build/svg/',
  vendors: 'src/js/_core/'
};

function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('css', () => {
  gulp.src(srcPaths.styl)
    .pipe(stylus({
      use: [rupture(), poststylus([lost(), fontMagician(), rucksack({ autoprefixer: true })])],
      compress: false
    }))
    .on('error', onError)
    .pipe(postcss([
      require('mdcss')({
        logo: '../logo-kratos.png',
        examples: {
          css: ['../build/css/*.css']
        }
      })
    ]))
    .on('error', onError)
    .pipe(gcmq())
    .pipe(cssnano())
    .pipe(gulp.dest(buildPaths.css));
});

gulp.task('vendor', () => {
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

gulp.task('jade', () => {
  gulp.src(srcPaths.jade)
    .pipe(plumber())
    .pipe(jade())
    .on('error', onError)
    .pipe(gulp.dest(buildPaths.jade));
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

gulp.task('icons', () => {
  gulp.src(srcPaths.icons)
    .pipe(svgmin())
    .pipe(svgstore({ fileName: 'icons.svg', inlineSvg: true}))
    .pipe(cheerio({
      run: function ($, file) {
          $('svg').addClass('hide');
          $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest(buildPaths.svg))
    .pipe(gulp.dest(srcPaths.svg));
});

gulp.task('watch', () => {
  gulp.watch(srcPaths.jade, ['jade']);
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

gulp.task('default', ['css', 'jade', 'js', 'images', 'icons', 'watch', 'browser-sync']);
gulp.task('build', ['css', 'jade', 'js', 'images', 'icons']);

