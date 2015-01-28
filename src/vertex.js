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

  Object.defineProperties(v, {
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
