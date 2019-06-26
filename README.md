## Bananabuilder
Static site generator. Get started with compiling your nunjucks, sass and javascript files. Complete with a live reload and production builds.

### Getting started
Run 'npm install' in the root folder with this structure
```
|- dist/
  |- css/
  |- js/
|- nunjucks/
  |- layout.nj
  |- data.json
  |- pages/
    |- about.nj
    |- contact.nj
    |- index.nj
  |- templates/
    |- macros/
      |- navigation.nj
    |- partials/
      |- gallery.nj
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