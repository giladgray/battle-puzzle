expect = require('chai').expect
sinon = require 'sinon'

Board = require '../app/scripts/board.coffee'

fillRowsWithColors = (r, c) -> if r is 1 then 'blue' else 'green'

cellsEqual = (board1, board2) ->
  board1.eachCell (cell, row, col) ->
    expect(cell).to.deep.equal board2[row][col]

describe 'Board', ->
  board = null
  beforeEach ->
    board = new Board(3, 3)

  it 'creates a board with given size', ->
    expect(board).to.exist

  it 'contains 9 cells in 3 rows and 3 columns', ->
    spy = sinon.spy()
    board.eachCell(spy)
    expect(spy.callCount).to.equal 9, 'incorrect board size'

  describe '#fill()', ->
    it 'fills board with value', ->
      value = 'foo'
      board.fill(value)
      cellsEqual board, ((value for c in [0...3]) for r in [0...3])

    it 'fills board with function', ->
      fn = (r, c) -> r * c
      board.fill(fn)
      cellsEqual board, ((fn(r, c) for c in [0...3]) for r in [0...3])

  describe '#put()', ->
    it 'put sets new cell value', ->
      expect(board.cell 1, 1).to.equal Board.Cell.EMPTY
      board.put 1, 1, 'WHOA'
      expect(board.cell(1, 1).value).to.equal 'WHOA'

  describe '#neighbors()', ->
    beforeEach ->
      board.fill (r, c) -> r * c

    it 'neighbors are CSS-ordered (top, right, bottom, left)', ->
      neighbors = board.neighbors(1, 1)
      expect(neighbors).to.deep.equal [
        board.cell(0, 1), board.cell(1, 2), board.cell(2, 1), board.cell(1, 0)
      ]

    it 'center cell has four neighbors', ->
      neighbors = board.neighbors(1, 1)
      expect(neighbors.length).to.equal 4

    it 'top-left cell has empty top & left neighbors', ->
      neighbors = board.neighbors(0, 0)
      expect(neighbors[0]).to.equal Board.Cell.EMPTY
      expect(neighbors[3]).to.equal Board.Cell.EMPTY

    it 'bottom-right cell has empty bottom & right neighbors', ->
      neighbors = board.neighbors(2, 2)
      expect(neighbors[1]).to.equal Board.Cell.EMPTY
      expect(neighbors[2]).to.equal Board.Cell.EMPTY

  describe '#block()', ->
    beforeEach ->
      board.fill fillRowsWithColors

    it 'returns array of coordinates of matching neighbor cells', ->
      block = board.block(1, 0)
      expect(block.length).to.equal 3
      expect(block).to.have.members [board.cell(1, 0), board.cell(1, 1), board.cell(1, 2)]

    it 'returns only adjacent, contiguous cells', ->
      block = board.block(0, 0)
      expect(block.length).to.equal 3
      expect(block).to.have.members [board.cell(0, 0), board.cell(0, 1), board.cell(0, 2)]

  describe '#remove()', ->
    beforeEach ->
      board.fill fillRowsWithColors

    it 'removes all cells passed to it', ->
      block = board.block(1, 0)
      board.remove block...
      for cell in block
        expect(board.cell(cell.row, cell.col).value).to.be.empty

    it 'pushes empty cells to ends of rows', ->
      board.remove board.cell(0, 0)
      expect(board.cell(0, 2).value).to.be.empty

  describe '#refill()', ->
    beforeEach ->
      board.fill fillRowsWithColors
      block = board.block(1, 0)
      board.remove block...

    it 'iterator is called only for empty cells', ->
      spy = sinon.spy()
      board.refill spy
      expect(spy.callCount).to.equal 3
      # all cells in row 1
      expect(spy.alwaysCalledWith(1)).to.be.true
