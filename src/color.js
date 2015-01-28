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
