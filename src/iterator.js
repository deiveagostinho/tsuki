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
