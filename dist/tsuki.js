(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./src/index')

},{"./src/index":5}],2:[function(require,module,exports){
var Graph = require('./graph')

/*

 Vertex Coloring Algorithm.

 To consider:
   1. It's a greedy algorithm.
   2. It's not optimal.
   3. There's no other way around.
   5. VCA performs differently depending on how the vertices are ordered within a set.
   6. Interval and Indifference graphes when ordered by Lexographic Breadth-First Search
   results in a VCA performing optimal :+1:.

 @params   {graph} g
 @return   {graph}

*/

var Coloring = function (g, ordering){
  
  var _g       = g.clone()
    , it       = Graph.Iterator.new(_g).order(ordering)
    , labels   = Object.create([]) // keep all labels used
    , vertices = Object.create({})
  
  _g.forEach(function(v){
    v.extend({
      label: 0
    })
  })

  // side-effect :(
  buildLabeledVertices(vertices, labels, it.get(), 1)
  it = it.next()

  // O(v,ev)
  it.do(function(v, key){

    // get all neighbors' labels
    var nl = v.mapToArray(function(e){
      return it.at(e.in).label
    })
    // only unique labels
    .filter(function(l, i, self) {
      return self.indexOf(l) == i
    })
    
    var hasMin = labels
    // diff between neighbors' labels and used labels
    .filter(function(l){
      return nl.indexOf(l) < 0
    })
    // find min label
    .reduce(function(acc, l){
      return acc > l ? l : acc
    }, Infinity)

    // find max neighbors' label
    var maxL = labels
    .reduce(function(acc, l){
      return acc > l ? acc : l
    }, -Infinity)
    
    maxL = maxL == -Infinity ? 0 : maxL

    hasMin == Infinity ?
        buildLabeledVertices(vertices, labels, v, maxL + 1)
      : buildLabeledVertices(vertices, labels, v, hasMin)
    
  })
  
  return Graph.diff(_g, {vs: vertices})
}

function buildLabeledVertices (vertices, labels, v, label) {
  v.label = label
  vertices[v._id] = v
  labels.push(label)
}

module.exports = Object.freeze(Coloring)

},{"./graph":4}],3:[function(require,module,exports){
/*
*
* Edge def
*
*/

var Edge = Object.create({})

/*

  Creates new Egde.

  @params:
    in   :: Number
    out  :: Number
    d    :: Boolean
    cost :: Number

  @return:
    e    :: Edge

*/

Edge.new = function(_in, out, d, cost){
  var e    = Object.create(Edge)
    , d    = !!d
    , cost = cost || Infinity

  Object.defineProperty(e, '_type', {
    value: 'edge'
  })

  Object.defineProperties(e, {
    'directed': {
        get: function(){
        return d
      }
      , enumerable: true
    }
  , 'in': {
      get: function(){
        return _in._id || _in
      }
      , enumerable: true
    }
  , 'out': {
      get: function(){
        return out._id || out
      }
      , enumerable: true
    }
  , 'cost': {
      get: function(){
        return cost
      }
      , enumerable: true
    }
  })

  delete e.new

  return Object.freeze(e)
}

/*

  Checks whether the param v is a vertex or not.

  @params:
    e   :: Object

  @return:
        :: Boolean

*/

Edge.clone = function (es) {  
  var _es = Object.create({})
  
  Object.keys(es).map(function(key){
    _es[key] = Edge.new(es[key].in, es[key].out, es[key].d, es[key].cost)
  })
  
  return _es
}

Edge.isEdge = function(e){
  return e._type == 'edge'
}


module.exports = Object.freeze(Edge)

},{}],4:[function(require,module,exports){
var Vertex    = require('./vertex')
  , Iterator  = require('./iterator')

/*
*
* Graph def
*
*/

var Graph = Object.create({})

Graph.new = function (name, desc, di, vs) {
  var vs      = Vertex.clone(vs || {})
    , g       = Object.create(Graph)
    , di      = di || false

  Object.defineProperties(g, {
    '_vs': {
        get: function () {
        return vs
      }
      , enumerable: true
    }
    , '_type': {
        value: 'graph'
    }
    , 'name' : {
        value: name
      , enumerable: true
    }
    , 'desc' : {
        value: desc
      , enumerable: true
    }
    , 'directed' : {
        value: di
      , enumerable: true
    }
  })

  delete g.new

  return Object.freeze(g)
}

Graph.clone = function (g) {
  return Graph.new(this.name, this.desc, this.di, this._vs)
}

Graph.diff = function (old, props){

  var name = props.name ? props.name : old.name
  var desc = props.desc ? props.desc : old.desc
  var di   = props.di   ? props.di   : old.directed
  var vs   = props.vs   ? props.vs   : old._vs

  return Graph.new(name, desc, di, vs)
}

Graph.addVertex = function (name, v){

  var vs = this._vs
    , it = Iterator.new(this)

  if(it.has(name)){
    throw new Error("The name you've provided already exists. Try removing it first or changing the name.")
  }

  var vertex = Vertex.new(name, v)
  vs[vertex._id] = vertex

  return Graph.diff(this, {vs: vs})
}

Graph.removeVertex = function (v){

  var vs = this._vs
    , it = Iterator.new(this)

  if(it.has(name)){
    throw new Error("The vertex you're looking for doesn't exist.")
  }

  // Removes all edges before removing the vertex
  v._edges.iterate(function(n){
    Iterator.new(this, n.in).get().removeEdge(n.out)
  }.bind(this))

  // If it's a Digraph, all edges connected to v must be removed
  if(this.di){
    vs = this.map(function(vertex){
      return vertex.edges.filter(function(e){
        return e.out != v._id
      })
    })
  }

  delete vs[v._id]

  return Graph.diff(this, {vs: vs})
}

Graph.clean = function (){
  return Graph.new(this.name, this.desc)
}

Graph.degree = function (){
  var max = -Infinity

  this.mapToArray(function(v, k){
    return v.degree()
  })
  .forEach(function(d){
    if(d > max) max = d
  })

  return max
}

Graph.n = function (){
  return Object.keys(this._vs).length
}

Graph.isGraph = function (g){
  return g._type == 'graph'
}

Graph.fromObject = function (o){
  var name      = o.name
    , desc      = o.desc
    , di        = o.directed
    , vertices  = o.vertices || o.nodes
    , edges     = o.edges
    , vs        = Vertex.fromObject(vertices, edges, di)

  return Graph.diff(name, desc, di, vs)
}

Graph.toObject = function (){
  var o = Object.create({})

  o.name      = this.name
  o.desc      = this.desc
  o.directed  = this.directed
  
  // export vertices
  o.nodes = this.mapToArray(function(v){
    return v.toObject()
  })
  
  // export edges
  o.edges = this.mapToArray(function(v){
    return v.exportEdges()
  })
  .reduce(function(acc, es){
     return acc.concat(es)
  })
  .filter(function(e, i, self) {
    return self.indexOf(e) === i
  })

  return o
}

Graph.map = function (f){
  var vs = Object.create({})

  this.forEach(function(v, key){
    vs[key] = f(v, key)
  })

  return vs
}

Graph.mapToArray = function (f){
  var vs = []

  this.forEach(function(v, key){
    vs.push(f(v, key))
  })

  return vs
}

Graph.filter = function(f){
  var vs = Object.create({})

  this.forEach(function(v, key){
    if(f(v, key)) vs[key] = v
  })

  return vs
}

Graph.forEach = function(f){
  var vs = this._vs
  Object.keys(vs).forEach(function(key, index){
    f(vs[key], key, index)
  })
}

Graph.exportByColor = function () {
  var colors = []
  
  var max = this.mapToArray(function(v){
    return v.label
  })
  .reduce(function(acc, l){
    return acc > l ? acc : l
  }, -Infinity)
  
  for(var i = 1; i <= max; i++){
    colors[i] = []
  }
  
  this.forEach(function(v){
    colors[v.label].push(v.toObject())
  })
  
  console.log(colors)

  return colors
}

Graph.Iterator = Iterator

module.exports = Object.freeze(Graph)

},{"./iterator":6,"./vertex":9}],5:[function(require,module,exports){
module.exports = {
  Graph: require('./graph'),
  Coloring: require('./color'),
  Ordering: require('./order')
}

},{"./color":2,"./graph":4,"./order":7}],6:[function(require,module,exports){
var Iterator = Object.create({})

Iterator.new = function(g, ord, index){
  var ord     = ord   || []
    , index   = index || 0
    , i       = Object.create(Iterator)

  Object.defineProperties(i, {
    '_i': {
      get: function(){
        return index
      }
    }
    , '_g': {
      get: function(){
        return g
      }
    }
    , '_ord': {
      get: function(){
          return ord
      }
      , set: function(_ord){
        ord = _ord
      }
    }
  })

  delete i.new

  return Object.freeze(i)
}

Iterator.diff = function (old, props) {
  var g      = props.g    ? props.g    : old._g
  var ord    = props.ord   ? props.ord  : old.ord
  var index  = props.index ? props.index : old.index
  
  return Iterator.new(g, ord, index)
}

Iterator.get = function () {
  return this._g._vs[this._ord[this._i]]
}

Iterator.has = function (name) {
  return !!this._g._vs[name]
}

Iterator.at = function (name) {
  return this._g._vs[name]
}

Iterator.order = function (ordering) {
  this._ord = ordering(this._g)

  return this
}

Iterator.reset = function () {
  return Iterator.diff(this, {g: this._g, ord: this._ord, index: 0})
}

Iterator.do = function (f) {
  var it = this

  while(it.hasNext()){
    f(it.get(), it._i)
    it = it.next()
  }
}

Iterator.next = function () {
  return Iterator.diff(this, {g: this._g, ord: this._ord, index: this._i + 1})
}

Iterator.prev = function () {
  return Iterator.diff(this, {g: this._g, ord: this._ord, index: this._i - 1})
}

Iterator.hasNext = function () {
  return this._i <= this._ord.length - 1
}

Iterator.hasPrev = function () {
  return this._i >= 0
}

module.exports = Object.freeze(Iterator)

},{}],7:[function(require,module,exports){
var Order = Object.create({})
  , _     = require('./utils')

var diff = function (as, bs){
  return as.filter(function(a){
    return bs.indexOf(a) < 0
  })
}

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

Order.BFT = function (g) {
  
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

},{"./utils":8}],8:[function(require,module,exports){
var Utils = Object.create({})

/*

  Utils is a collection of small curried
  fns intended to be composed.

*/

Utils.diff = function (as) {
  return function (bs) {
    return as.filter(function(a){
      return bs.indexOf(a) < 0
    })
  }
}

//Utils.without = function (as) {
//  return function (b) {
//    return as.filter(a) {
//      return 
//    }
//  }
//}

module.exports = Utils

},{}],9:[function(require,module,exports){
var Edge   = require('./edge')

/*
 *
 * Vertex def

 */

var Vertex = {}

/*

  Creates new Vertex.

  @params:
    props :: Object

  @return:
    v     :: Vertex

*/

Vertex.new  = function(name, props){
  var v     = Object.create(Vertex)
    , edges = {}

  Object.defineProperty(v, {
    '_id': {
      get: function(){
        return name
      }
    }
  , 'name': {
        value: name
      , enumerable: true
    }
  , '_edges': {
        get: function(){
        return edges
      }
      , set: function(_edges){
        edges = _edges
      }
      , enumerable: true
    }
  , '_type': {
        value: 'vertex'
      , enumerable: true
    }
  })

  Object.keys(props).forEach(function(key){
    v[key] = props[key]
  })

  delete v.new

  return v
}


/*

  Add an edge between the 2 vertices.

  @params:
    vertex1  :: Vertex
    vertex2  :: Vertex

  @return:
    vertex   :: Vertex

*/

Vertex.clone = function (vs) {
  var _vs = {}

  Object.keys(vs).forEach(function(v){

    var _v = Vertex.new(v, vs[v])
    _v._edges = Edge.clone(vs[v]._edges)

    _vs[v] = _v
  })

  return _vs

}

Vertex.addEdge = function(v2, directed, cost){

  vertexChecker(v2)

  var edges = this._edges
    , edge  = Edge.new(v2, this, directed, cost)

  if(!this.hasEdge(v2)){
    edges[v2._id] = edge
  }

  this._edges = edges

  if(!directed){
    v2.addEdge(this, edge)
  }

  return this
}

/*

  Remove an edge between the 2 vertices.

  @params:
    v1   :: Vertex
    v2   :: Vertex

  @return:
    v    :: Vertex

*/

Vertex.removeEdge = function (v2){

  vertexChecker(v2)

  var edges = this._edges
    , edge  = null

  if(!this.hasEdge(v2)){
    edge = edges[v2._id]
    delete edges[v2._id]
  }

  if(edge && !edge.directed){
    v2.removeEgde(this)
  }

  this._edges = edges

  return v1
}

/*

  Calculates the number of edges of a vertex.

  @params:
    v1   :: Vertex

  @return:
         :: Number

*/

Vertex.degree = function(){
  return Object.keys(this._edges).length
}

/*

  Add a non-enumerable property to Vertex.

  @params:
    v           :: Vertex
    property    :: String
    value       :: a

  @return:
    _v          :: Vertex

*/

function addProperty (v, key, value) {

  Object.defineProperty(v, key, {
      get: function(){
      return value
    }
    , set: function(_value){
      value = _value
    }
    , enumerable: true
  })

  return v
}

Vertex.extend = function(props){
  Object.keys(props).forEach(function(key){
    addProperty(this, key, props[key])
  }.bind(this))

  return this
}

Vertex.map = function (f) {
  var edges = {}

  this.forEach(function(v, key){
    edges[key] = f(v, key)
  })

  return edges
}

Vertex.mapToArray = function (f) {
  var edges = []

  this.forEach(function(v, key){
    edges.push(f(v, key))
  })

  return edges
}

Vertex.filter = function (f) {
  var edges = {}

  this.forEach(function(v, key){
    if(f(v, key)) edges[key] = v
  })

  return edges
}

Vertex.forEach = function(f){
  Object.keys(this._edges).forEach(function(key){
    f(this._edges[key], key)
  }.bind(this))
}

/*

  Checks whether the param v is a vertex or not.

  @params:
    v1   :: Object

  @return:
         :: Boolean

*/

Vertex.isVertex = function(v){
  return v._type == 'vertex'
}

/*

  Checks whether there's an edge between 2 vertices.

  @params:
    v1   :: Vertex
    v2   :: Vertex

  @return:
         :: Boolean

*/

Vertex.hasEdge = function (v2) {
  return !!this._edges[v2._id]
}

Vertex.toObject = function () {
  var v = Object.create({})

  Object.keys(this).forEach(function(key){
    v[key] = this[key]
  }.bind(this))

  return v
}

Vertex.exportEdges = function () {
  var es = []

  this.forEach(function(e){
    es.push({
        in: e.in
      , out: e.out
      , cost: e.cost
    })
  })
  
  return es
}

/*

  Helper Functions

*/

function vertexChecker(v) {
  if(!Vertex.isVertex(v)){
    throw new Error("Oops, it's not vertex. Try Vertex.new() before.")
  }
}

module.exports = Object.freeze(Vertex)

},{"./edge":3}]},{},[1]);
