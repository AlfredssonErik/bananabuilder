## Bananabuilder
Get started with compiling your sass and javascript files. Complete with a live reload and production builds.

### Getting started
Run 'npm install' in the root folder with this structure
```
|- dist/
  |- css/
  |- js/
  |- index.html
|- sass/
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