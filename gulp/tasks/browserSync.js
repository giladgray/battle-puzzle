var gulp = require('gulp');

gulp.task('browserSync', ['build'], function() {
  var browserSync = require('browser-sync');
  var config      = require('../config').browserSync;

  browserSync(config);
});
