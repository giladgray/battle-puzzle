Cell = require './cell'

class Board
  @Cell: Cell

  # Create a new empty board with the given number of rows and columns. Indices outside of these
  # bounds will always return empty values. Dimensions cannot be changed after creation.
  # @param rows  [Number] number of rows in board
  # @param cols  [Number] number of columns in board
  # @param value [Object,Function] (optional) initial value of each cell, see {#fill()}
  constructor: (@rows, @cols, value) ->
    @_board = ((null for c in [0...cols]) for r in [0...rows])
    @fill(value) if value?

  # Function to determine if two cells have the same value. Can be overridden to suit your needs.
  # @param cell1 [Cell] first cell
  # @param cell2 [Cell] second cell
  # @return [Boolean] whether two cells have the same value
  comparator: (cell1, cell2) -> Object.is cell1.value, cell2.value

  # Get the row at the given index, or empty row if out of bounds.
  # @param row [Number] row index
  # @return [Array<Columns>] the row, or empty array if out of bounds.
  row: (row) ->
    return @_board[row] or []

  # Get the cell at given index, or empty object if not found.
  # @param row [Number] row index
  # @param col [Number] column index
  # @return [Object] cell value stored at this location
  cell: (row, col) ->
    return @row(row)[col] or Cell.EMPTY

  # Puts the value at the given cell index.
  # @param row   [Number] row index
  # @param col   [Number] column index
  # @param value [Object] value to store in cell
  put: (row, col, value) ->
    @_board[row][col] = new Cell(value, row, col)

  # Removes the given cells from the board and pushes empty cells to the end of updated rows.
  # @see #refill() to populate newly added empty cells.
  # @param cells [Cell...] splat of cells to remove from the board.
  remove: (cells...) ->
    # sort by descending column value to prevent double-deletion
    cells = cells.sort((a, b) -> b.col - a.col)
    for cell in cells
      @_board[cell.row].splice cell.col, 1
      @_board[cell.row].push new Cell
    # reset cell coordinates
    @eachCell (value, row, col, cell) ->
      cell.row = row
      cell.col = col
    return

  # Returns an array of [top, right, bottom, left] neighbor cells (like CSS properties).
  # @return [Array<Cell>] top, right, bottom, left neighbors
  neighbors: (row, col) ->
    top    = @cell(row - 1, col)
    right  = @cell(row, col + 1)
    bottom = @cell(row + 1, col)
    left   = @cell(row, col - 1)
    return [top, right, bottom, left]

  # Run a function for each cell in the board grid. Iterator receives `(cell, row, col)`: value
  # in the cell, row index, column index.
  # @param iterator [Function] function called for each cell
  # @param thisArg  [Object]   (optional) `this` binding of iterator
  eachCell: (iterator, thisArg) ->
    for row, r in @_board
      for cell, c in row
        iterator.call thisArg, cell?.value, r, c, cell

  # Fill every cell in the board with a given value, or a function that receives `(row, col)` and
  # returns value for that cell.
  # @param value [Function] function called to produce value for each cell
  # @param thisArg  [Object]   (optional) `this` binding of value
  fill: (value, thisArg) ->
    iterator = if typeof value is 'function' then value else (-> value)
    @eachCell (cell, row, col) => @put row, col, iterator(row, col)

  # Fill every *empty* cell in the board with a given value, or a function that receives
  # `(row, col)` and returns value for that cell. An empty cell is a cell in the bounds of the board
  # with a null value.
  # @param value [Function] function called to produce value for empty cell
  # @param thisArg  [Object]   (optional) `this` binding of value
  refill: (value, thisArg) ->
    iterator = if typeof value is 'function' then value else (-> value)
    @eachCell (cell, row, col) => @put(row, col, iterator(row, col)) unless cell?
    # TODO: almost identical to fill()

  # processes the board for rendering in angular. populates a $layout property on each cell with
  # an array of `classes` and an array of `corner` directions for that cell.
  # returns the board itself, which is an array of arrays: `board[row][col]`.
  processRows: ->
    # compute group-position classes for each cell
    @eachCell (value, row, col, cell) =>
      [above, next, below, prev] = @neighbors(row, col)
      classes = []
      classes.push('first') unless @comparator(cell, prev)
      classes.push('last')  unless @comparator(cell, next)
      classes.push('above') if @comparator(cell, below)
      classes.push('below') if @comparator(cell, above)
      cell.$layout = {classes}

    # compute corner elements for each cell
    @eachCell (value, row, col, cell) =>
      [above, next, below, prev] = @neighbors(row, col)
      corners = []
      if @comparator(cell, below)
        if @comparator(cell, prev) and 'first' in below.$layout.classes
          corners.push 'bottom left'
        if @comparator(cell, next) and 'last' in below.$layout.classes
          corners.push 'bottom right'

      if @comparator(cell, above)
        if @comparator(cell, prev) and 'first' in above.$layout.classes
          corners.push 'top left'
        if @comparator(cell, next) and 'last' in above.$layout.classes
          corners.push 'top right'
      cell.$layout.corners = corners

    return @_board

  markId = 0
  block: (row, col) ->
    block   = []
    queue   = []
    marker  = "mark#{markId++}"
    target  = @cell(row, col)
    enqueue = (cell) ->
      cell[marker] = true
      queue.push cell
    enqueue(target)
    while queue.length
      cell = queue.pop()
      block.push(cell) if @comparator(target, cell)
      # queue non-empty unvisited neighbors
      for cell in @neighbors(cell.row, cell.col) when @comparator(target, cell)
        enqueue(cell) unless cell[marker]
    # remove marker to avoid polluting cells
    @eachCell (v, r, c, cell) -> delete cell[marker]
    return block


module.exports = Board

###
TODO: tests, input validation (in bounds)
###
