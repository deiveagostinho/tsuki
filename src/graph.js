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
