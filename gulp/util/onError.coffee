path   = require 'path'
notify = require 'gulp-notify'

# Send error to notification center with gulp-notify
module.exports = (args...) ->
  notify.onError(
    title: 'Compile Error'
    message: (error) ->
      # basic message includes filename (or fileName when Handlebars) and message
      message = "#{path.basename(error.filename or error.fileName)}\n#{error.message}"
      # include line/column information if present (CoffeeScript)
      if error.location?
        message += " on line #{error.location.first_line + 1}, \
          column #{error.location.first_column + 1}"
      return message
  ).apply this, args

  # Keep gulp from hanging on this task
  @emit 'end'
