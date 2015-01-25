gulp = require 'gulp'

# Compile Handlebars templates and rename path to plugin uri
gulp.task 'handlebars', ->
  changed    = require 'gulp-changed'
  count      = require 'gulp-count'
  handlebars = require 'gulp-handlebars'
  onError    = require '../util/onError'
  reload     = require 'gulp-livereload'
  wrap       = require 'gulp-wrap'

  config = require('../config').handlebars

  # stream all the source files...
  gulp.src config.src
    # ... filter to files that have changed since last run
    .pipe changed(config.dest, {extension: '.js'})
    # ... actually compile the template
    .pipe handlebars()
      .on 'error', onError
    # ... wrap the template in call to Handlebars.template()
    #     @see https://github.com/lazd/gulp-handlebars
    .pipe wrap('Handlebars.template(<%= contents %>);')
    # ... write to destination
    .pipe gulp.dest(config.dest)
    # ... log the number of files processed
    .pipe count('## templates compiled.')
    # ... and livereload the page (js changes cause a full page refresh)
    .pipe reload()
