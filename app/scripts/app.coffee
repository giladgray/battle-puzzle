Board = require './board'


pieces = ['one', 'two', 'three', 'four']
randomPiece = ->
  pieces[Math.floor(Math.random() * pieces.length)]


app = angular.module 'puzzleBattle', []

app.directive 'gameBoard', ->
  restrict: 'E'
  templateUrl: 'board.html'
  controllerAs: 'game'
  controller: ($attrs) ->
    @board = new Board $attrs.rows, $attrs.cols

    # fill board with random pieces
    @newGame = ->
      @board.fill randomPiece
    @newGame()

    @remove = (cell) ->
      block = @board.block(cell.row, cell.col)
      @board.remove block...
      @board.refill randomPiece
