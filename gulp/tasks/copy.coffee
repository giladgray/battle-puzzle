gulp = require 'gulp'

###
Copy sets of files in one task. Accepts three formats: simple {src, dest} object,
expanded {src: {path: glob}, dest: 'base/dest/path'} object, or array of {src, dest} entries.

@example Simple object format
# Copy a single glob to a single destination directory:
copy({
  src: '*.html'
  dest: dest
})
@example Expanded object format
# Copy several globs to different subfolders of destination directory:
copy({
  # joins dest with src key for each glob
  src:
    '.': '*.html'     # copied to dest/*.html
    fonts: 'fonts/**' # copied to dest/fonts/**
    vendor: ['node_modules/a', 'node_modules/b', ...] # copied to dest/vendor/{a,b}
  dest: dest # root destination directory
})
@example Array of {src, dest} entries
# Copy a series of globs to different destinations:
# (Note that this format does not support expanded objects as above.)
copy([
  src: '*.html'
  dest: dest
,
  src: 'fonts/**'
  dest: "#{dest}/fonts"
])
###
gulp.task 'copy', ->
  gutil   = require 'gulp-util'
  changed = require 'gulp-changed'
  count   = require '../util/count'

  config  = require('../config').copy

  # copy src glob to dest path + log count
  copy = (src, dest) ->
    gulp.src(src)
      .pipe changed(dest)
      .pipe gulp.dest(dest)
      .pipe count('Copied <%= counter %> to ' + gutil.colors.cyan(dest))

  # throw an error due to unknown format
  error = (arg) -> throw new gutil.PluginError('copy', "unknown spec format for input '#{arg}'")

  # array of entries: [{src, dest}]
  if Array.isArray copy
    # simply copy each src to dest
    for spec in config
      copy spec.src, spec.dest

  # object format: {src: ?, dest: 'base/dest/path'}
  else if typeof config is 'object'

    # ...where src is a single glob or array of globs
    if Array.isArray(config.src) or typeof config.src is 'string'
      copy config.src, config.dest

    # ...where src is {path: glob}
    else if typeof config.src is 'object'
      path = require 'path'
      for dest, src of config.src
        copy src, path.join(config.dest, dest)

    else error(config.src)

  else error(config)
