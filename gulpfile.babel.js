'use strict';

import gulp from 'gulp';
import help from 'gulp-help';
const helper = help(gulp);
import config from './gulp.config'
import log from './log'
import poststylus from 'poststylus';
import rucksack from 'rucksack-css';
import fontMagician from 'postcss-font-magician';
import gcmq from 'gulp-group-css-media-queries';
import lost from 'lost';
import rupture from 'rupture';
import browserSync from 'browser-sync';
import mdcss from 'mdcss';
import loadPlugins from 'gulp-load-plugins'
let plugins = loadPlugins();

function onError(err) {
  log(err);
  this.emit('end');
}

gulp.task('css', 'Build Styl files using postcss', () => {
  gulp.src(config.source.styl)
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
    .pipe(gcmq())
    .pipe(plugins.cssnano())
    .pipe(gulp.dest(config.build.css));
});

gulp.task('vendors', 'Compile vendor scripts', () => {
  gulp.src(config.source.vendors)
    .pipe(plugins.plumber())
    .pipe(plugins.concat('vendors.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.build.vendors));
});

gulp.task('js', 'Build js scripts', () => {
  gulp.src(config.source.js)
    .pipe(plugins.plumber())
    .pipe(plugins.concat('main.js'))
    .pipe(plugins.uglify())
    .on('error', onError)
    .pipe(gulp.dest(config.build.js));
});

gulp.task('html', 'Build pug files and create html', () => {
  gulp.src(config.source.html)
    .pipe(plugins.plumber())
    .pipe(plugins.pug())
    .on('error', onError)
    .pipe(gulp.dest(config.build.html));
});

gulp.task('images', 'Change images location and uses optimization', () => {
  gulp.src(config.source.img)
    .pipe(plugins.plumber())
    .pipe(plugins.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      }))
    .pipe(gulp.dest(config.build.img));
});

gulp.task('icons', 'Task to buid svg icons', () => {
  gulp.src(config.source.icons)
    .pipe(plugins.svgmin())
    .pipe(plugins.svgstore({ fileName: 'icons.svg', inlineSvg: true }))
    .pipe(plugins.cheerio({
      run: function ($, file) {
          $('svg').addClass('hide');
          $('[fill]').removeAttr('fill');
        },

      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest(config.build.svg));
});

gulp.task('watch','Wathc all files and waits changes', () => {
  gulp.watch(config.source.css, ['css'])
  .on('change', (event) => {
    log('File ' + event.path + ' was ' + event.type + ', running css tasks...');
  });
  gulp.watch(config.source.js, ['js'])
  .on('change', (event) => {
    log('File ' + event.path + ' was ' + event.type + ', running sass tasks...');
  });

  gulp.watch(config.source.html, { debounceDelay: 300 }, ['html']);
  gulp.watch(config.source.img, ['images']);
  gulp.watch(config.source.icons, ['icons']);
});


gulp.task('browser-sync', 'Create a browser-sync server' ,() => {
  var files = [
    config.build.build
  ];

  browserSync.init(files, {
    server: {
      baseDir: './build/'
    },
  });

});

gulp.task('serve', 'build everythig, watch files and create a server', ['css', 'html', 'vendors', 'js', 'images', 'icons', 'watch', 'browser-sync']);
gulp.task('build', 'Build everything',['css', 'html', 'vendors', 'js', 'images', 'icons']);

