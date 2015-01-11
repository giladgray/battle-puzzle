Board = require './board'

$ ->
  pieces = ['one', 'two', 'three', 'four']
  randomPiece = ->
    pieces[Math.floor(Math.random() * pieces.length)]

  # generate random board!
  rows = $('.game-row').length
  cols = Math.floor $('.game-cell').length / rows
  board = new Board rows, cols
  $('.game-cell').each (index) ->
    col = index % rows
    row = Math.floor(index / cols)
    piece = randomPiece()
    board.put row, col,
      piece: piece
      el: $(this)
    $(this).addClass piece

  # create a corner element for given directions
  corner = (directions) -> $('<div>').addClass("corner #{directions}")

  # recompute all cell classes and corners
  recompute = ->
    board.eachCell (cell) ->
      cell.el.removeClass().addClass("game-cell #{cell.piece}").html('')

    # cell classes based on surrounding piece colors
    board.eachCell (cell, row, col) ->
      prev = board.cell(row, col - 1)
      next = board.cell(row, col + 1)
      below = board.cell(row + 1, col)

      if cell.piece isnt prev.piece
        cell.el.addClass 'first'
      if cell.piece isnt next.piece
        cell.el.addClass 'last'
      if cell.piece is below.piece
        cell.el.addClass 'above'
        below.el.addClass 'below'

    # add corner elements--need full knowledge of first/last/above/below
    board.eachCell (cell, row, col) ->
      prev = board.cell(row, col - 1)
      next = board.cell(row, col + 1)
      above = board.cell(row - 1, col)
      below = board.cell(row + 1, col)

      if below.piece is cell.piece
        if prev.piece is cell.piece and below.el.hasClass 'first'
          cell.el.append corner('bottom left')
        if next.piece is cell.piece and below.el.hasClass 'last'
          cell.el.append corner('bottom right')

      if above.piece is cell.piece
        if prev.piece is cell.piece and above.el.hasClass 'first'
          cell.el.append corner('top left')
        if next.piece is cell.piece and above.el.hasClass 'last'
          cell.el.append corner('top right')

  recompute()

  # click cell to rotate through pieces
  $('.game-cell').click ->
    $el = $(@)
    col = $el.index()
    row = $el.parent().index()
    piece = board.cell(row, col).piece
    index = pieces.indexOf(piece)
    board.cell(row, col).piece = pieces[(index + 1) % pieces.length]
    recompute()
