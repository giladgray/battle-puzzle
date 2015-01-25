gulp = require 'gulp'

gulp.task 'sass', ['images'], ->
  autoprefixer = require 'gulp-autoprefixer'
  browserSync  = require 'browser-sync'
  onError      = require '../util/onError'
  count        = require 'gulp-count'
  sass         = require 'gulp-sass'

  config = require('../config').sass

  gulp.src(config.src)
    .pipe sass(config.options)
      .on 'error', onError
    .pipe autoprefixer(browsers: ['last 2 version'])
    .pipe gulp.dest(config.dest)
    .pipe count(logFiles: true)
    .pipe browserSync.reload(stream: true)
