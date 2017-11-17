## Bananabuilder
Get started with compiling your less/sass and javascript files. Complete with a live reload and production builds.

### Getting started
Run 'npm install' in the root folder with this structure
```
|- dist/
  |- css/
  |- js/
  |- index.html
|- less/
|- script/
|- gulpfile.js
|- node_modules/
|- package.json
```
### Commands

To start a live reload of your working files:
```
gulp watch
```
To run the build once without live reload:
```
gulp build
```
Add '--prod' to build a production version
```
gulp build --prod
```
If you want to use sass instead of less. Switch out the 'less' in the gulpfile to 'sass'
