<p>
  <img src="https://cloud.githubusercontent.com/assets/3603793/14390922/a999424c-fd8f-11e5-8fbb-ab908a1d4740.png" width="200">
</p>

# Kratos Boilerplate

This projects uses Jade, Stylus, Gulp and Browsersync.

Maybe you want to read about them:
- [GulpJS](http://gulpjs.com/)
- [Jade](http://jade-lang.com/)
- [Stylus](http://learnboost.github.io/stylus/)
- [Browsersync](https://www.browsersync.io/)

For grid system uses [Lost](https://github.com/peterramsing/lost) with some help from [Rucksack](http://simplaio.github.io/rucksack/) for animations, reset and a lot of great mixins, [Rupture](https://github.com/jenius/rupture) for responsive utilities. And [Font Magician](https://github.com/jonathantneal/postcss-font-magician/) to get the webfonts.


## Getting Started

### Installation

First of all, install the dependencies to run this boilerplate.

- [NodeJS](http://nodejs.org/)
- [GulpJS](http://gulpjs.com/)


```sh
# Clone this repository
$ git clone git@github.com:LFeh/kratos-boilerplate.git
$ cd kratos-boilerplate

# install gulp globally
$ npm install -g gulp

# install dependencies
$ npm install

```

With the commands above, you have everything to start.

### Folders and Files

```sh
├── README.md
├── build
│   ├── css
│   │   └── main.css
│   ├── img
│   │   └── eventos.jpg
│   ├── index.html
│   └── js
│       └── main.js
├── gulpfile.babel.js
├── package.json
└── src
    ├── img
    │   └── eventos.jpg
    ├── js
    │   ├── main.js
    ├── styl
    │   ├── _core/*.styl
    │   ├── atoms/*.styl
    │   ├── molecules/*.styl
    │   ├── organisms/*.styl
    │   ├── pages/*.styl 
    │   └── main.styl
    └── templates
        └── index.jade
```

Those folders and file will change during the project.


### Code Standarts

This project uses my own [Coding Style](https://github.com/LFeh/coding-style) as code reference.

This project also uses [Husky](https://github.com/typicode/husky) to prevent commit and push messy and wrong code.

To help you, this project has a `npm run fix` command to fix all jscs errors.


### Tasks

- `gulp`: run all tasks and initialize watch for changes and a server
- `gulp js`: execute js files
- `gulp jade`: compile jade files
- `gulp css`: compile stylus files
- `gulp images`: compress image files
- `gulp browser-sync`: inicialize a server
- `gulp watch`: call for watch files 
- `gulp build`: run all tasks  


## Credits

This boierplate uses as a base the awesome [Qualy Boierplate](https://github.com/Qualy-org/qualy) by [@Willian_justen](https://twitter.com/Willian_justen).


## License

[MIT License](http://felipefialho.mit-license.org/) © Luiz Felipe Tartarotti Fialho
