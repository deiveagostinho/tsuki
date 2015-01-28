var Search = Object.create({})
  , BFT    = require('./order').BFT

Search.BFS = function (g) {
  return function (i, key) {
    return g.Iterator.new(g).order(BFT).do(function(v){
      if(i[key] == v[key]) return v
    })
  }
}

module.exports = Search
