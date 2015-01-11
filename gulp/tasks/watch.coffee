###
Notes:
  - gulp/tasks/browserify.js handles js recompiling with watchify
  - gulp/tasks/browserSync.js watches and reloads compiled files
###

gulp = require 'gulp'
gutil = require 'gulp-util'

gulp.task 'setWatch', ->
  global.isWatching = true

# Configure watcher for every task spec with option `watch: true`
gulp.task 'watch', ['setWatch', 'browserSync'], ->
  config = require '../config'

  for task, spec of config when spec.watch
    if typeof spec.src is 'object' and not Array.isArray spec.src
      # create mega-glob for copy-style specs
      sources = (src for path, src of spec.src)
    else sources = spec.src
    gulp.watch sources, [task]
    gutil.log "Watching '#{gutil.colors.cyan(task)}' sources..."
