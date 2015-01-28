var Order = Object.create({})
  , diff  = require('./utils').diff

Order.RandomSequence = function (g) {
  return shuffle(
    g.mapToArray(function(v){
      return v.name
    })
  )
}

Order.LargestFirst = function (g) {
  return g
    .mapToArray(function(v){
      return v
    })
    .sort(function(a, b){
      return a.degree() - b.degree()
    })
    .reverse()
    .map(function(v){
      return v.name
    })
}

Order.LexBFS = function(g){

  // keep 2 arrays of labeled vertices
  // must have 2 copies once one of them is going to be consumed
  var vl  = []
    , _vl = {}
    , vs  = []
    , Q   = {}
    , n   = g.n()
  
  g.forEach(function(v, key, index){
    var _v = {
      name   : key,
      i      : n - 1 - index,
      label  : '∅', // initialize all vertices as ∅
      es     : v.mapToArray(function(e){ return e.in })
    }
    
    vl.push(_v)
    _vl[_v.name] = _v
    
  })

  vl.label = '∅'
  Q[vl.label] = vl

  var labelVertex = function(v){

    // if w is still in Q
    _.diff(v.es)(vs.map(function(v){ return v.name }))
    .forEach(function(w){

      // grab whole object
      w = _vl[w]

      var predList = Q[w.label + v.i]

      // if there's list that preceeds L(w), adds w
      if(predList){
        predList.push(w)
      }
      // if not, creates a list, adds w and append to Q
      else {
        predList = [w]
        predList.label = w.label + v.i

        Q[predList.label] = predList
      }

      // remove w from Q
      Q[w.label] = Q[w.label].filter(function(q){
        return q.name != w.name
      })

      // if there's no more a list called L(w), delete it
      if(Q[w.label].length == 0){
         delete Q[w.label]
      }

      // update L(w)
      w.label = w.label + v.i
    })
  }
  
  while(Object.keys(Q).length > 0){
    var l = Object.keys(Q).sort().reverse()[0]
      , v = Q[l][0]
    
    Q[l] = Q[l].filter(function(q){
      return q.name != v.name
    })

    if(Q[l].length == 0) delete Q[l]

    vs.push(v)
    labelVertex(v)
  }

  // return ordered vertices
  return vs.map(function(v){
    return v.name
  })
}

Order.BFS = function (g) {
  
  var ord = []
  var it = g.Iterator.new(g)
  var vs = g.mapToArray(function(v){
    return v.name
  })
  
  var i = 0
    , n = g.n()
  
  ord.push(vs[0])
  
  while(ord.length < n){
    
    if(i == ord.length){
      ord.push(diff(vs, ord)[0])
    }
    
    var v = it.at(ord[i])
    var edges = v.mapToArray(function(e){
      return e.in
    })
    
    edges.unshift(v.name)
    
    var ds = diff(edges, ord)
    ord = ord.concat(ds)
    i++
  }
  
  return ord
}


function shuffle (a) {
  for(var j, x, i = a.length; i; j = parseInt(Math.random() * i, 10), x = a[--i], a[i] = a[j], a[j] = x);
  return a
}

module.exports = Order
