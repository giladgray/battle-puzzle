gulp = require 'gulp'

# `gulp` alone watches all files.
# Note that 'watch' depends on 'build' so it first compiles everything.
gulp.task 'default', ['watch']

# `gulp build` compiles all sources, no sweats.
gulp.task 'build', ['browserify', 'sass', 'copy']
