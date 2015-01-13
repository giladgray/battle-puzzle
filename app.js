(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./app/scripts/app.coffee":[function(require,module,exports){
var Board, app, pieces, randomPiece;

Board = require('./board');

pieces = ['one', 'two', 'three', 'four'];

randomPiece = function() {
  return pieces[Math.floor(Math.random() * pieces.length)];
};

app = angular.module('puzzleBattle', []);

app.directive('gameBoard', function() {
  return {
    restrict: 'E',
    templateUrl: 'board.html',
    controllerAs: 'game',
    controller: function($attrs) {
      this.board = new Board($attrs.rows, $attrs.cols);
      this.newGame = function() {
        return this.board.fill(function() {
          return {
            piece: randomPiece()
          };
        });
      };
      this.newGame();
      return this.rotate = function(cell) {
        var index;
        index = pieces.indexOf(cell.piece);
        return cell.piece = pieces[(index + 1) % pieces.length];
      };
    }
  };
});



},{"./board":"/Users/ggray/code/puzzle-battle/app/scripts/board.coffee"}],"/Users/ggray/code/puzzle-battle/app/scripts/board.coffee":[function(require,module,exports){
var Board,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Board = (function() {
  function Board(rows, cols, value) {
    var i, j;
    this._board = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= rows ? _i < rows : _i > rows; i = 0 <= rows ? ++_i : --_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (j = _j = 0; 0 <= cols ? _j < cols : _j > cols; j = 0 <= cols ? ++_j : --_j) {
            _results1.push(null);
          }
          return _results1;
        })());
      }
      return _results;
    })();
    if (value != null) {
      this.fill(value);
    }
  }

  Board.prototype.row = function(row) {
    return this._board[row] || [];
  };

  Board.prototype.cell = function(row, col) {
    return this.row(row)[col] || {};
  };

  Board.prototype.put = function(row, col, value) {
    return this._board[row][col] = value;
  };

  Board.prototype.neighbors = function(row, col) {
    var bottom, left, right, top;
    top = this.cell(row - 1, col);
    right = this.cell(row, col + 1);
    bottom = this.cell(row + 1, col);
    left = this.cell(row, col - 1);
    return [top, right, bottom, left];
  };

  Board.prototype.eachCell = function(iterator, thisArg) {
    var c, cell, r, row, _i, _len, _ref, _results;
    _ref = this._board;
    _results = [];
    for (r = _i = 0, _len = _ref.length; _i < _len; r = ++_i) {
      row = _ref[r];
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (c = _j = 0, _len1 = row.length; _j < _len1; c = ++_j) {
          cell = row[c];
          _results1.push(iterator.call(thisArg, cell, r, c));
        }
        return _results1;
      })());
    }
    return _results;
  };

  Board.prototype.fill = function(iterator, thisArg) {
    if (_.isFunction(iterator)) {
      return this.eachCell((function(_this) {
        return function(cell, row, col) {
          return _this.put(row, col, iterator.call(thisArg, row, col));
        };
      })(this));
    } else {
      return this.eachCell((function(_this) {
        return function(cell, row, col) {
          return _this.put(row, col, iterator);
        };
      })(this));
    }
  };

  Board.prototype.rows = function() {
    this.eachCell((function(_this) {
      return function(cell, row, col) {
        var above, below, classes, next, prev, _ref;
        _ref = _this.neighbors(row, col), above = _ref[0], next = _ref[1], below = _ref[2], prev = _ref[3];
        classes = [];
        if (cell.piece !== prev.piece) {
          classes.push('first');
        }
        if (cell.piece !== next.piece) {
          classes.push('last');
        }
        if (cell.piece === below.piece) {
          classes.push('above');
        }
        if (cell.piece === above.piece) {
          classes.push('below');
        }
        return cell.$layout = {
          classes: classes
        };
      };
    })(this));
    this.eachCell((function(_this) {
      return function(cell, row, col) {
        var above, below, corners, next, prev, _ref;
        _ref = _this.neighbors(row, col), above = _ref[0], next = _ref[1], below = _ref[2], prev = _ref[3];
        corners = [];
        if (below.piece === cell.piece) {
          if (prev.piece === cell.piece && __indexOf.call(below.$layout.classes, 'first') >= 0) {
            corners.push('bottom left');
          }
          if (next.piece === cell.piece && __indexOf.call(below.$layout.classes, 'last') >= 0) {
            corners.push('bottom right');
          }
        }
        if (above.piece === cell.piece) {
          if (prev.piece === cell.piece && __indexOf.call(above.$layout.classes, 'first') >= 0) {
            corners.push('top left');
          }
          if (next.piece === cell.piece && __indexOf.call(above.$layout.classes, 'last') >= 0) {
            corners.push('top right');
          }
        }
        return cell.$layout.corners = corners;
      };
    })(this));
    return this._board;
  };

  return Board;

})();

module.exports = Board;


/*
TODO: tests, input validation (in bounds)
 */



},{}]},{},["./app/scripts/app.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZ2dyYXkvY29kZS9wdXp6bGUtYmF0dGxlL2FwcC9zY3JpcHRzL2FwcC5jb2ZmZWUiLCIvVXNlcnMvZ2dyYXkvY29kZS9wdXp6bGUtYmF0dGxlL2FwcC9zY3JpcHRzL2JvYXJkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsK0JBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBQVIsQ0FBQTs7QUFBQSxNQUdBLEdBQVMsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLE9BQWYsRUFBd0IsTUFBeEIsQ0FIVCxDQUFBOztBQUFBLFdBSUEsR0FBYyxTQUFBLEdBQUE7U0FDWixNQUFPLENBQUEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsTUFBTSxDQUFDLE1BQWxDLENBQUEsRUFESztBQUFBLENBSmQsQ0FBQTs7QUFBQSxHQVFBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxjQUFmLEVBQStCLEVBQS9CLENBUk4sQ0FBQTs7QUFBQSxHQVVHLENBQUMsU0FBSixDQUFjLFdBQWQsRUFBMkIsU0FBQSxHQUFBO1NBQ3pCO0FBQUEsSUFBQSxRQUFBLEVBQVUsR0FBVjtBQUFBLElBQ0EsV0FBQSxFQUFhLFlBRGI7QUFBQSxJQUVBLFlBQUEsRUFBYyxNQUZkO0FBQUEsSUFHQSxVQUFBLEVBQVksU0FBQyxNQUFELEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxLQUFBLENBQU0sTUFBTSxDQUFDLElBQWIsRUFBbUIsTUFBTSxDQUFDLElBQTFCLENBQWIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxTQUFBLEdBQUE7ZUFDVCxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxTQUFBLEdBQUE7aUJBQUc7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eEIsRUFBQSxNQUFBLE1BQWhDO0FBQ0UsWUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLGNBQWIsQ0FBQSxDQURGO1dBSEY7U0FGQTtBQVFBLFFBQUEsSUFBRyxLQUFLLENBQUMsS0FBTixLQUFlLElBQUksQ0FBQyxLQUF2QjtBQUNFLFVBQUEsSUFBRyxJQUFJLENBQUMsS0FBTCxLQUFjLElBQUksQ0FBQyxLQUFuQixJQUE2QixlQUFXLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBekIsRUFBQSxPQUFBLE1BQWhDO0FBQ0UsWUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLFVBQWIsQ0FBQSxDQURGO1dBQUE7QUFFQSxVQUFBLElBQUcsSUFBSSxDQUFDLEtBQUwsS0FBYyxJQUFJLENBQUMsS0FBbkIsSUFBNkIsZUFBVSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQXhCLEVBQUEsTUFBQSxNQUFoQztBQUNFLFlBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxXQUFiLENBQUEsQ0FERjtXQUhGO1NBUkE7ZUFhQSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQWIsR0FBdUIsUUFkZjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVYsQ0FWQSxDQUFBO0FBMEJBLFdBQU8sSUFBQyxDQUFBLE1BQVIsQ0E1Qkk7RUFBQSxDQXpETixDQUFBOztlQUFBOztJQU5GLENBQUE7O0FBQUEsTUE2Rk0sQ0FBQyxPQUFQLEdBQWlCLEtBN0ZqQixDQUFBOztBQStGQTtBQUFBOztHQS9GQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJCb2FyZCA9IHJlcXVpcmUgJy4vYm9hcmQnXG5cblxucGllY2VzID0gWydvbmUnLCAndHdvJywgJ3RocmVlJywgJ2ZvdXInXVxucmFuZG9tUGllY2UgPSAtPlxuICBwaWVjZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcGllY2VzLmxlbmd0aCldXG5cblxuYXBwID0gYW5ndWxhci5tb2R1bGUgJ3B1enpsZUJhdHRsZScsIFtdXG5cbmFwcC5kaXJlY3RpdmUgJ2dhbWVCb2FyZCcsIC0+XG4gIHJlc3RyaWN0OiAnRSdcbiAgdGVtcGxhdGVVcmw6ICdib2FyZC5odG1sJ1xuICBjb250cm9sbGVyQXM6ICdnYW1lJ1xuICBjb250cm9sbGVyOiAoJGF0dHJzKSAtPlxuICAgIEBib2FyZCA9IG5ldyBCb2FyZCAkYXR0cnMucm93cywgJGF0dHJzLmNvbHNcblxuICAgICMgZmlsbCBib2FyZCB3aXRoIHJhbmRvbSBwaWVjZXNcbiAgICBAbmV3R2FtZSA9IC0+XG4gICAgICBAYm9hcmQuZmlsbCAtPiBwaWVjZTogcmFuZG9tUGllY2UoKVxuICAgIEBuZXdHYW1lKClcblxuICAgICMgcm90YXRlIHRoaXMgY2VsbCB0byBuZXh0IHBpZWNlXG4gICAgQHJvdGF0ZSA9IChjZWxsKSAtPlxuICAgICAgaW5kZXggPSBwaWVjZXMuaW5kZXhPZihjZWxsLnBpZWNlKVxuICAgICAgY2VsbC5waWVjZSA9IHBpZWNlc1soaW5kZXggKyAxKSAlIHBpZWNlcy5sZW5ndGhdXG4iLCJjbGFzcyBCb2FyZFxuICAjIENyZWF0ZSBhIG5ldyBlbXB0eSBib2FyZCB3aXRoIHRoZSBnaXZlbiBudW1iZXIgb2Ygcm93cyBhbmQgY29sdW1ucy4gSW5kaWNlcyBvdXRzaWRlIG9mIHRoZXNlXG4gICMgYm91bmRzIHdpbGwgYWx3YXlzIHJldHVybiBlbXB0eSB2YWx1ZXMuIERpbWVuc2lvbnMgY2Fubm90IGJlIGNoYW5nZWQgYWZ0ZXIgY3JlYXRpb24uXG4gICMgQHBhcmFtIHJvd3MgIFtOdW1iZXJdIG51bWJlciBvZiByb3dzIGluIGJvYXJkXG4gICMgQHBhcmFtIGNvbHMgIFtOdW1iZXJdIG51bWJlciBvZiBjb2x1bW5zIGluIGJvYXJkXG4gICMgQHBhcmFtIHZhbHVlIFtPYmplY3QsRnVuY3Rpb25dIChvcHRpb25hbCkgaW5pdGlhbCB2YWx1ZSBvZiBlYWNoIGNlbGwsIHNlZSB7I2ZpbGwoKX1cbiAgY29uc3RydWN0b3I6IChyb3dzLCBjb2xzLCB2YWx1ZSkgLT5cbiAgICBAX2JvYXJkID0gKChudWxsIGZvciBqIGluIFswLi4uY29sc10pIGZvciBpIGluIFswLi4ucm93c10pXG4gICAgaWYgdmFsdWU/XG4gICAgICBAZmlsbCB2YWx1ZVxuXG4gICMgR2V0IHRoZSByb3cgYXQgdGhlIGdpdmVuIGluZGV4LCBvciBlbXB0eSByb3cgaWYgb3V0IG9mIGJvdW5kcy5cbiAgIyBAcGFyYW0gcm93IFtOdW1iZXJdIHJvdyBpbmRleFxuICAjIEByZXR1cm4gW0FycmF5PENvbHVtbnM+XSB0aGUgcm93LCBvciBlbXB0eSBhcnJheSBpZiBvdXQgb2YgYm91bmRzLlxuICByb3c6IChyb3cpIC0+XG4gICAgcmV0dXJuIEBfYm9hcmRbcm93XSBvciBbXVxuXG4gICMgR2V0IHRoZSBjZWxsIGF0IGdpdmVuIGluZGV4LCBvciBlbXB0eSBvYmplY3QgaWYgbm90IGZvdW5kLlxuICAjIEBwYXJhbSByb3cgW051bWJlcl0gcm93IGluZGV4XG4gICMgQHBhcmFtIGNvbCBbTnVtYmVyXSBjb2x1bW4gaW5kZXhcbiAgIyBAcmV0dXJuIFtPYmplY3RdIGNlbGwgdmFsdWUgc3RvcmVkIGF0IHRoaXMgbG9jYXRpb25cbiAgY2VsbDogKHJvdywgY29sKSAtPlxuICAgIHJldHVybiBAcm93KHJvdylbY29sXSBvciB7fVxuXG4gICMgUHV0cyB0aGUgdmFsdWUgYXQgdGhlIGdpdmVuIGNlbGwgaW5kZXguXG4gICMgQHBhcmFtIHJvdyAgIFtOdW1iZXJdIHJvdyBpbmRleFxuICAjIEBwYXJhbSBjb2wgICBbTnVtYmVyXSBjb2x1bW4gaW5kZXhcbiAgIyBAcGFyYW0gdmFsdWUgW09iamVjdF0gdmFsdWUgdG8gc3RvcmUgaW4gY2VsbFxuICBwdXQ6IChyb3csIGNvbCwgdmFsdWUpIC0+XG4gICAgQF9ib2FyZFtyb3ddW2NvbF0gPSB2YWx1ZVxuXG4gICMgUmV0dXJucyBhbiBhcnJheSBvZiBbdG9wLCByaWdodCwgYm90dG9tLCBsZWZ0XSBuZWlnaGJvciBjZWxscyAobGlrZSBDU1MgcHJvcGVydGllcykuXG4gICMgQHJldHVybiBbQXJyYXk8Q2VsbD5dIHRvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdCBuZWlnaGJvcnNcbiAgbmVpZ2hib3JzOiAocm93LCBjb2wpIC0+XG4gICAgdG9wICAgID0gQGNlbGwocm93IC0gMSwgY29sKVxuICAgIHJpZ2h0ICA9IEBjZWxsKHJvdywgY29sICsgMSlcbiAgICBib3R0b20gPSBAY2VsbChyb3cgKyAxLCBjb2wpXG4gICAgbGVmdCAgID0gQGNlbGwocm93LCBjb2wgLSAxKVxuICAgIHJldHVybiBbdG9wLCByaWdodCwgYm90dG9tLCBsZWZ0XVxuXG4gICMgUnVuIGEgZnVuY3Rpb24gZm9yIGVhY2ggY2VsbCBpbiB0aGUgYm9hcmQgZ3JpZC4gSXRlcmF0b3IgcmVjZWl2ZXMgYChjZWxsLCByb3csIGNvbClgOiB2YWx1ZVxuICAjIGluIHRoZSBjZWxsLCByb3cgaW5kZXgsIGNvbHVtbiBpbmRleC5cbiAgIyBAcGFyYW0gaXRlcmF0b3IgW0Z1bmN0aW9uXSBmdW5jdGlvbiBjYWxsZWQgZm9yIGVhY2ggY2VsbFxuICAjIEBwYXJhbSB0aGlzQXJnICBbT2JqZWN0XSAgIChvcHRpb25hbCkgYHRoaXNgIGJpbmRpbmcgb2YgaXRlcmF0b3JcbiAgZWFjaENlbGw6IChpdGVyYXRvciwgdGhpc0FyZykgLT5cbiAgICBmb3Igcm93LCByIGluIEBfYm9hcmRcbiAgICAgIGZvciBjZWxsLCBjIGluIHJvd1xuICAgICAgICBpdGVyYXRvci5jYWxsIHRoaXNBcmcsIGNlbGwsIHIsIGNcblxuICAjIEZpbGwgZXZlcnkgY2VsbCBpbiB0aGUgYm9hcmQgd2l0aCBhIGdpdmVuIHZhbHVlLCBvciBhIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYChyb3csIGNvbClgIGFuZFxuICAjIHJldHVybnMgdmFsdWUgZm9yIHRoYXQgY2VsbC5cbiAgIyBAcGFyYW0gaXRlcmF0b3IgW0Z1bmN0aW9uXSBmdW5jdGlvbiBjYWxsZWQgdG8gcHJvZHVjZSB2YWx1ZSBmb3IgZWFjaCBjZWxsXG4gICMgQHBhcmFtIHRoaXNBcmcgIFtPYmplY3RdICAgKG9wdGlvbmFsKSBgdGhpc2AgYmluZGluZyBvZiBpdGVyYXRvclxuICBmaWxsOiAoaXRlcmF0b3IsIHRoaXNBcmcpIC0+XG4gICAgaWYgXy5pc0Z1bmN0aW9uIGl0ZXJhdG9yXG4gICAgICBAZWFjaENlbGwgKGNlbGwsIHJvdywgY29sKSA9PlxuICAgICAgICBAcHV0IHJvdywgY29sLCBpdGVyYXRvci5jYWxsKHRoaXNBcmcsIHJvdywgY29sKVxuICAgIGVsc2VcbiAgICAgIEBlYWNoQ2VsbCAoY2VsbCwgcm93LCBjb2wpID0+IEBwdXQgcm93LCBjb2wsIGl0ZXJhdG9yXG5cbiAgIyBwcm9jZXNzZXMgdGhlIGJvYXJkIGZvciByZW5kZXJpbmcgaW4gYW5ndWxhci4gcG9wdWxhdGVzIGEgJGxheW91dCBwcm9wZXJ0eSBvbiBlYWNoIGNlbGwgd2l0aFxuICAjIGFuIGFycmF5IG9mIGBjbGFzc2VzYCBhbmQgYW4gYXJyYXkgb2YgYGNvcm5lcmAgZGlyZWN0aW9ucyBmb3IgdGhhdCBjZWxsLlxuICAjIHJldHVybnMgdGhlIGJvYXJkIGl0c2VsZiwgd2hpY2ggaXMgYW4gYXJyYXkgb2YgYXJyYXlzOiBgYm9hcmRbcm93XVtjb2xdYC5cbiAgcm93czogLT5cbiAgICAjIGNvbXB1dGUgZ3JvdXAtcG9zaXRpb24gY2xhc3NlcyBmb3IgZWFjaCBjZWxsXG4gICAgQGVhY2hDZWxsIChjZWxsLCByb3csIGNvbCkgPT5cbiAgICAgIFthYm92ZSwgbmV4dCwgYmVsb3csIHByZXZdID0gQG5laWdoYm9ycyhyb3csIGNvbClcbiAgICAgIGNsYXNzZXMgPSBbXVxuICAgICAgY2xhc3Nlcy5wdXNoKCdmaXJzdCcpIGlmIGNlbGwucGllY2UgaXNudCBwcmV2LnBpZWNlXG4gICAgICBjbGFzc2VzLnB1c2goJ2xhc3QnKSAgaWYgY2VsbC5waWVjZSBpc250IG5leHQucGllY2VcbiAgICAgIGNsYXNzZXMucHVzaCgnYWJvdmUnKSBpZiBjZWxsLnBpZWNlIGlzIGJlbG93LnBpZWNlXG4gICAgICBjbGFzc2VzLnB1c2goJ2JlbG93JykgaWYgY2VsbC5waWVjZSBpcyBhYm92ZS5waWVjZVxuICAgICAgY2VsbC4kbGF5b3V0ID0ge2NsYXNzZXN9XG5cbiAgICAjIGNvbXB1dGUgY29ybmVyIGVsZW1lbnRzIGZvciBlYWNoIGNlbGxcbiAgICBAZWFjaENlbGwgKGNlbGwsIHJvdywgY29sKSA9PlxuICAgICAgW2Fib3ZlLCBuZXh0LCBiZWxvdywgcHJldl0gPSBAbmVpZ2hib3JzKHJvdywgY29sKVxuICAgICAgY29ybmVycyA9IFtdXG4gICAgICBpZiBiZWxvdy5waWVjZSBpcyBjZWxsLnBpZWNlXG4gICAgICAgIGlmIHByZXYucGllY2UgaXMgY2VsbC5waWVjZSBhbmQgJ2ZpcnN0JyBpbiBiZWxvdy4kbGF5b3V0LmNsYXNzZXNcbiAgICAgICAgICBjb3JuZXJzLnB1c2ggJ2JvdHRvbSBsZWZ0J1xuICAgICAgICBpZiBuZXh0LnBpZWNlIGlzIGNlbGwucGllY2UgYW5kICdsYXN0JyBpbiBiZWxvdy4kbGF5b3V0LmNsYXNzZXNcbiAgICAgICAgICBjb3JuZXJzLnB1c2ggJ2JvdHRvbSByaWdodCdcblxuICAgICAgaWYgYWJvdmUucGllY2UgaXMgY2VsbC5waWVjZVxuICAgICAgICBpZiBwcmV2LnBpZWNlIGlzIGNlbGwucGllY2UgYW5kICdmaXJzdCcgaW4gYWJvdmUuJGxheW91dC5jbGFzc2VzXG4gICAgICAgICAgY29ybmVycy5wdXNoICd0b3AgbGVmdCdcbiAgICAgICAgaWYgbmV4dC5waWVjZSBpcyBjZWxsLnBpZWNlIGFuZCAnbGFzdCcgaW4gYWJvdmUuJGxheW91dC5jbGFzc2VzXG4gICAgICAgICAgY29ybmVycy5wdXNoICd0b3AgcmlnaHQnXG4gICAgICBjZWxsLiRsYXlvdXQuY29ybmVycyA9IGNvcm5lcnNcblxuICAgIHJldHVybiBAX2JvYXJkXG5cbm1vZHVsZS5leHBvcnRzID0gQm9hcmRcblxuIyMjXG5UT0RPOiB0ZXN0cywgaW5wdXQgdmFsaWRhdGlvbiAoaW4gYm91bmRzKVxuIyMjXG4iXX0=
