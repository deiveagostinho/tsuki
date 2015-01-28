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
