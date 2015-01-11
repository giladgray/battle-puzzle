class Board
  constructor: (rows, cols) ->
    @_board = ((null for j in [0...cols]) for i in [0...rows])

  row: (row) ->
    return @_board[row] or []

  cell: (row, col) ->
    return @row(row)[col] or {}

  # returns an array of [top, right, bottom, left] neighbor cells (like CSS properties).
  neighbors: (row, col) ->
    top    = @cell(row - 1, col)
    right  = @cell(row, col + 1)
    bottom = @cell(row + 1, col)
    left   = @cell(row, col - 1)
    return [top, right, bottom, left]

  put: (row, col, value) ->
    @_board[row][col] = value

  eachCell: (iterator, thisArg) ->
    for row, r in @_board
      for cell, c in row
        iterator.call thisArg, cell, r, c

  fill: (iterator, thisArg) ->
    @eachCell (cell, row, col) =>
      @put row, col, iterator.call(thisArg, row, col)

  # processes the board for rendering in angular. populates a $layout property on each cell with
  # an array of `classes` and an array of `corner` directions for that cell.
  # returns the board itself, which is an array of arrays: `board[row][col]`.
  rows: ->
    # compute group-position classes for each cell
    @eachCell (cell, row, col) =>
      [above, next, below, prev] = @neighbors(row, col)
      classes = []
      classes.push('first') if cell.piece isnt prev.piece
      classes.push('last')  if cell.piece isnt next.piece
      classes.push('above') if cell.piece is below.piece
      classes.push('below') if cell.piece is above.piece
      cell.$layout = {classes}

    # compute corner elements for each cell
    @eachCell (cell, row, col) =>
      [above, next, below, prev] = @neighbors(row, col)
      corners = []
      if below.piece is cell.piece
        if prev.piece is cell.piece and 'first' in below.$layout.classes
          corners.push 'bottom left'
        if next.piece is cell.piece and 'last' in below.$layout.classes
          corners.push 'bottom right'

      if above.piece is cell.piece
        if prev.piece is cell.piece and 'first' in above.$layout.classes
          corners.push 'top left'
        if next.piece is cell.piece and 'last' in above.$layout.classes
          corners.push 'top right'
      cell.$layout.corners = corners

    return @_board

module.exports = Board
