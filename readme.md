<p align="center">
  <img src="src/images/logo.png" width="200">
</p>

# Kratos Boilerplate

> A simple boilerplate for creating a static PWA using Webpack, Pug, PostCSS and CSS Modules

[![NPM Version][npm-badge]][npm-url]
[![license](https://img.shields.io/github/license/felipefialho/kratos-boilerplate.svg)](./license.md)
[![GitHub contributors](https://img.shields.io/github/contributors/felipefialho/kratos-boilerplate.svg)](https://github.com/felipefialho/kratos-boilerplate/graphs/contributors)

## Generate a new project with Yeoman

To make easy create a new projects, Kratos has a [generator using Yeoman](https://github.com/felipefialho/generator-kratos-boilerplate)

To use it:

```sh
# install yeoman
$ npm install -g yo

# install kratos generator
$ npm install -g generator-kratos-boilerplate

# generate a new project
$ yo kratos-boilerplate
```

## Getting Started

```sh
# install dependencies
$ npm i

# run the project
$ npm start
```

With the commands above, you have everything to start.

The `app.config.json` file has all minimal config to create your scaffolding.

## About CSS

This project use Sass as CSS preprocessor 😁

### Post CSS libs

For grid system uses [Autoprefixer](https://github.com/postcss/autoprefixer) to make easy use browser prefixes, [Lost](https://github.com/peterramsing/lost) with some help from, [Rucksack](http://simplaio.github.io/rucksack/) for animations, reset and a lot of great mixins, [Rupture](https://github.com/jenius/rupture) for responsive utilities. And [Font Magician](https://github.com/jonathantneal/postcss-font-magician/) to get the webfonts.

### CSS Modules

To make easier create your components and avoid a lot of problems, it boilerplate use [CSS Modules](https://github.com/css-modules/css-modules).

Example

```css
.host
  text-align center

.title
  font-size 4rem

.description
  font-size 2rem
```

After the transformation it will become like this

```css
._host_4897k_1 {
  text-align: center;
}

._title_4897k_9 {
  font-size: 4rem;
}

._description_4897k_12 {
  font-size: 2rem;
}
```

## Tasks

- `npm start`: run all tasks and initialize watch for changes and a server
- `npm run build`: run all production tasks create a `dist` folder to deploy
- `npm run lint`: lint javascript and css
- `npm run fix`: command to fix all eslint errors
- `npm run deploy`: run all tasks to build and deploy on gh-pages

## License

MIT License © Felipe Fialho

[npm-badge]: https://img.shields.io/npm/v/generator-kratos-boilerplate.svg
[npm-url]: https://www.npmjs.com/package/generator-kratos-boilerplate
