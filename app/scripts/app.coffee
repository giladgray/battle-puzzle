Board = require './board'


pieces = ['one', 'two', 'three', 'four']
randomPiece = ->
  pieces[Math.floor(Math.random() * pieces.length)]


app = angular.module 'puzzleBattle', []

app.directive 'gameBoard', ->
  restrict: 'E'
  templateUrl: 'board.html'
  controllerAs: 'game'
  controller: ($attrs, $rootScope) ->
    @score = 0

    # fill board with random pieces
    @newGame = ->
      @board = new Board +$attrs.rows, +$attrs.cols
      @board.fill randomPiece
    @newGame()

    @remove = (cell) ->
      block = @board.block(cell.row, cell.col)
      @score += block.length * block.length
      @board.remove block...
      @board.refill randomPiece

    $rootScope.$on 'newgame', (e, rows, cols) =>
      $attrs.rows = rows
      $attrs.cols = cols
      @newGame()

app.directive 'gameControls', ->
  restrict: 'E'
  templateUrl: 'controls.html'
  controllerAs: 'ctrl'
  controller: ['$rootScope', ($rootScope) ->
    @rows = 8
    @cols = 12

    @newGame = ->
      $rootScope.$broadcast 'newgame', @rows, @cols
  ]

app.directive 'gameScore', ->
  restrict: 'E'
  template: "<h1>{{game.score}}</h1>"
