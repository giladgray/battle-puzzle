gulp = require 'gulp'

gulp.task 'deploy', ->
  deploy = require 'gulp-gh-pages'
  config = require('../config').deploy

  gulp.src(config.src)
    .pipe deploy(config.options)
