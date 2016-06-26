'use strict';
var config = {
  source: {
    js: 'src/js/**/*.js',
    css: 'src/styl/**/*.styl',
    styl: 'src/styl/style.styl',
    html: 'src/pug/*.pug',
    icons: 'src/svg/icons/*',
    svg: 'src/svg/',
    img: 'src/img/**/*',
    vendors: [
    ]
  },
  build: {
    build: 'build/**/*',
    js: 'build/js/',
    css: 'build/css/',
    html: 'build/',
    img: 'build/img',
    svg: 'build/svg/',
    vendors: 'src/js/_core/'
  }
}

module.exports = config
