gutil   = require 'gulp-util'
through = require 'through2'
extend  = require('util')._extend

###
Count files in stream and log message when stream ends. Only counts *files*, ignores directories and
other types of stream contents. Supports buffer and stream contents. Passes files through unchanged.
Message is passed through `gutil.template` to allow for custom formatting. Also supports custom
logging (but defaults to `gutil.log`).

@param message [String] optional message format (see options)
@param options [Object] options object
@option message [String] message format string (default: `'## files'`). template has two
  variables: `counter` - the number of files processed, and `files` - string of the format
  `X file[s]` where X is `counter` and 'files' is pluralized if necessary. the symbol `'##'`
  is expanded internally to `<%= counter %>`.
@option options [Boolean] logFiles whether to log each file path as it is counted (default: `false`)
@option options [Function] logger function to call with formatted message (default: `gutil.log`)
@example
  gulp.src('*.html')
    .pipe count() # logs '36 files'
    .pipe count('found ## pages') # logs 'found 36 pages'
    .pipe count('<%= counter %> HTML files')  # logs '36 HTML files'
    .pipe count
      message: '<%= files %>? That\'s ## too many!'
      logger: (msg) -> alert(msg) # alerts "36 files? That's 36 too many!"
###
module.exports = (message, options = {}) ->
  # message argument is optional
  if typeof message is 'object'
    options = message
    message = undefined

  # default options
  options = extend {
    logger: gutil.log
    message: message or '## files'
  }, options

  counter = 0

  message = options.message.replace '##', '<%= counter %>'

  # transform: increment counter for every file
  increment = (file, enc, cb) ->
    if file.stat.isFile()
      counter++
      if options.logFiles
        options.logger file.path
    cb(null, file)

  # flush: log message when stream ends
  logCount = (cb) ->
    if counter > 0
      counterStr = gutil.colors.magenta(counter)
      filesStr = "#{counterStr} file#{(if counter > 1 then 's' else '')}"
      options.logger gutil.template(message, {files: filesStr, counter: counterStr, file: null})
    cb()

  return through.obj increment, logCount
