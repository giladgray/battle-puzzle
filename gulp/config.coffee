path = require 'path'
projectDir = path.join __dirname, '..'

# Directories!
# glob of directories that may contain source code:
src = './app'

# base path to destination, output path will be relative to this:
dest = './build'

###
Settings per task. Key is task name, settings generally follow this pattern:
```
task:
  src: glob of source files (inputs)
  dest: string destination directory, fed directly to gulp.dest
  watch: boolean to toggle watching all src files, or glob to specify files to watch.
    runs task name when watched files are changed. if glob is provided then the glob will be
    recompiled on watch instead of the entire src glob (dramatically reduces compile times).
  compilerOptions: options object passed to a relevant compiler in the task
    (only supported by coffee)
```

Deviations from this pattern will be annotated with an @see link to relevant documentation.

What is a glob? @see https://github.com/isaacs/node-glob
###
module.exports =
  browserSync:
    server:
      # We're serving the src folder as well for sass sourcemap linking
      baseDir: [dest, src]

    files: [
      "#{dest}/**"
      # Exclude Map files
      "!#{dest}/**.map"
    ]

  browserify:
    # Enable source maps
    debug: true
    # Additional file extentions to make optional
    extensions: ['.coffee', '.hbs']
    # A separate bundle will be generated for each bundle config in the list below
    bundleConfigs: [
      entries: "#{src}/scripts/app.coffee"
      dest: dest
      outputName: 'app.js'
    ]

  sass:
    watch: true
    src: "#{src}/styles/*.{sass,scss}"
    dest: dest
    options:
      # Required if you want to use SASS syntax
      # See https://github.com/dlmanning/gulp-sass/issues/81
      sourceComments: 'map'
      imagePath: '/images' # Used by the image-url helper
      includePaths: require('node-bourbon').with('node_modules/font-awesome/scss')

  # compress and copy images
  images:
    src: []
    dest: dest
    watch: false

  # just straight copy static assets
  copy:
    src:
      '.': [
        "#{src}/html/**"
      ]
      vendor: [
        'node_modules/normalize.css/normalize.css'
        'node_modules/angular/angular.js'
        'node_modules/jquery/dist/jquery.js'
        'node_modules/lodash/lodash.js'
      ]
      fonts: [
        'node_modules/font-awesome/fonts/**'
      ]
    dest: dest
    watch: true

  # livereload server options, used in watch task.
  # disable by setting to false. provide an object to customize.
  # @see https://github.com/napcs/node-livereload#api-options
  livereload: true
