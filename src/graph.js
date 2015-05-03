var I = require('immutable')
  , R = require('ramda')

/*
*
* Graph def
*
*/

var Graph = function (d) {
  this.directed = d || false
  this.al       = null
  this.vs       = null
}

function graphFactory (d, al, vs) {
  var g = new Graph()

  g.directed = d
  g.ajList   = al
  g.vs       = vs

  return g
}

function toS (value) {
  return value.toString()
}


// API

Graph.prototype.addVertex = function (v, obj){
  v = toS(v)
  if(this.vs && this.vs.contains(v)){
    throw new Error('Vertex "' + v + '" has already been added')
  }

  var vs = this.vs === null ? I.Map([[v, obj]])  : this.vs.set(v, obj)
  var al = this.al === null ? I.Map([[v, null]]) : this.al.set(v, null) 

  return graphFactory(this.d, al, vs)
}

Graph.prototype.removeVertex = function (){
  v = toS(v)
  if(this.vs && this.vs.contains(v)){
    throw new Error('Vertex "' + v + '" does not exist')
  }

  var vs = this.vs.remove(v)
  var al = this.al.remove(v)

  return graphFactory(this.d, al, vs)
}

Graph.prototype.addEdge = function (v1, v2, w){
  v1 = toS(v1)
  v2 = toS(v2)
  w = w >= 0 ? w : 1

  if(this.vs && this.vs.contains(v1)){
    throw new Error('Vertex "' + v1 + '" does not exist')
  }
  if(this.vs && this.vs.contains(v2)){
    throw new Error('Vertex "' + v2 + '" does not exist')
  }

  var edges = this.al.get(v) === null ? I.Map([[v2, w]]) : this.al.get(v).add(v2, w)
  var al = this.al.set(v, edges)

  return graphFactory(this.d, al, this.vs)
}

Graph.prototype.removeEdge = function (v1, v2){
  v1 = toS(v1)
  v2 = toS(v2)
  w = w >= 0 ? w : 1

  if(this.vs && !this.vs.contains(v1)){
    throw new Error('Vertex "' + v1 + '" does not exist')
  }
  if(this.vs && !this.vs.contains(v2)){
    throw new Error('Vertex "' + v2 + '" does not exist')
  }
  if(this.al.get(v1) && !this.al.get(v1).contains(v2)){
    throw new Error(v1 + "-" +v2 + '" is not an edge')
  }

  var edges = this.al.get(v).remove(v2)
  var al = this.al.set(v, edges)

  return graphFactory(this.d, al, this.vs)
}

Graph.prototype.clean = function (){
  return new Graph()
}

Graph.prototype.degree = function (){
  return R.compose(R.max, g.ajList.map)(R.prop('size'))
}

Graph.prototype.size = function (){
  return g.vs.size
}

Graph.prototype.isGraph = function (g){
    return g.prototype === Graph
}


module.exports = Graph