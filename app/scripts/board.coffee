class Board
  constructor: (rows, cols) ->
    @_board = ([] for i in [0...rows])
    console.log @_board

  row: (row) ->
    return @_board[row] or []

  col: (col) ->
    # return @_board[]

  cell: (row, col) ->
    return @row(row)[col] or {}

  put: (row, col, value) ->
    @_board[row][col] = value

  eachCell: (iterator, thisArg) ->
    for row, r in @_board
      for cell, c in row
        iterator.call thisArg, cell, r, c

module.exports = Board
