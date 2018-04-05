# gulp-html-rename [![NPM](https://nodei.co/npm/gulp-html-rename.png)](https://nodei.co/npm/gulp-html-rename/)
> An HTML, CSS and JavaScript id and class minimiser.

This plugin only renames ids with a prefix of `id-` and classes with a prefix of `class-`.
You can specify more prefixes though the options object.

[Polymer](https://github.com/polymer/polymer) element names are included by default (`iron-`, `paper-`, ...)

## Usage

First, install `gulp-html-rename` as a development dependency:

```shell
npm install --save-dev gulp-html-rename
```

Then, add it to your `gulpfile.js`:

### Default Rename
```javascript
const gulpHTMLRename = require('gulp-html-rename');

gulp.task('rename', function(){
  gulp.src(['build/**/*'])
    .pipe(gulpHTMLRename())
    .pipe(gulp.dest('build/'));
});
```
### Custom Replace
```javascript
const gulpHTMLRename = require('gulp-html-rename');
const options = [
  'my-id-'
];

gulp.task('rename', function(){
  gulp.src(['build/**/*'])
    .pipe(gulpHTMLRename(options))
    .pipe(gulp.dest('build/'));
});
```
### Custom File extensions

> html, css and js are included by default

```javascript
const gulpHTMLRename = require('gulp-html-rename');

gulp.task('rename', function(){
  gulp.src(['build/**/*'])
    .pipe(htmlRename([], ['ts']))
    .pipe(gulp.dest('build/'));
});
```


## API

gulp-html-rename can be called with options.

### gulpHTMLRename(options, allowedExtensions)

#### options
Type: `Array`

The array with prefix strings.

### allowedExtensions
Type: `Array`

The array with file extensions.

[npm-url]: https://npmjs.org/package/gulp-html-rename
