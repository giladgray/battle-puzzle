gulp = require 'gulp'

gulp.task 'images', ->
  changed  = require 'gulp-changed'
  imagemin = require 'gulp-imagemin'

  config   = require('../config').images

  gulp.src config.src
    # ... Ignore unchanged files
    .pipe changed(config.dest)
    # ... Optimize
    .pipe imagemin()
    .pipe gulp.dest(config.dest)
