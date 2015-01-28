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

module.exports = Utils
