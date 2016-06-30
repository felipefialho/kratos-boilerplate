'use strict';

import gulp from 'gulp';
import loader from 'gulp-load-plugins';
import poststylus from 'poststylus';
import rucksack from 'rucksack-css';
import fontMagician from 'postcss-font-magician';
import sourcemaps from 'gulp-sourcemaps';
import lost from 'lost';
import rupture from 'rupture';
import yaml from 'js-yaml';
import browserSync from 'browser-sync';
import mdcss from 'mdcss';
import fs from 'fs';

let plugins = loader({
  rename: {
    'gulp-group-css-media-queries': 'gcmq'
  }
});

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
    .pipe(plugins.stylus({
      use: [rupture(), poststylus([lost(), fontMagician(), rucksack({ autoprefixer: true })])],
      compress: false
    }))
    .on('error', onError)
    .pipe(plugins.postcss([
      mdcss({
        logo: '../logo-kratos.png',
        examples: {
          css: ['../build/css/style.css']
        }
      })
    ]))
    .on('error', onError)
    .pipe(plugins.gcmq())
    .pipe(plugins.cssnano())
    .pipe(gulp.dest(buildPaths.css));
});

gulp.task('vendors', () => {
  gulp.src(srcPaths.vendors)
    .pipe(plugins.plumber())
    .pipe(plugins.concat('vendors.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(buildPaths.vendors));
});

gulp.task('js', () => {
  gulp.src(srcPaths.js)
    .pipe(plugins.plumber())
    .pipe(plugins.concat('main.js'))
    .pipe(plugins.uglify())
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
    .pipe(plugins.plumber())
    .pipe(plugins.data(dataJson))
    .pipe(plugins.pug())
    .on('error', onError)
    .pipe(gulp.dest(buildPaths.html));
});

gulp.task('images', () => {
  gulp.src(srcPaths.img)
    .pipe(plugins.plumber())
    .pipe(plugins.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      }))
    .pipe(gulp.dest(buildPaths.img));
});

gulp.task('icons', () => {
  gulp.src(srcPaths.icons)
    .pipe(plugins.svgmin())
    .pipe(plugins.svgstore({ fileName: 'icons.svg', inlineSvg: true }))
    .pipe(plugins.cheerio({
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

gulp.task('default', ['css', 'read:data', 'html', 'vendors', 'js', 'images', 'icons', 'watch', 'browser-sync']);
gulp.task('build', ['css', 'read:data', 'html', 'vendors', 'js', 'images', 'icons']);

