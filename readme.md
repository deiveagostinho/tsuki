![](tsuki.png)

Graph library for JavaScript. And its algorithmic friends.

Warning
-------

It's **not** production-ready. The current implementation relies on (weak) immutability by doing intermediate (deep) copies. We all know it generates too much garbage. I'm going to replace intermediate copies by another clever way of doing this, probably using [Immutable.js](https://github.com/facebook/immutable-js) or [Mori](https://github.com/swannodette/mori).

Browser Compatibility
---------------------

The current browser compatibility is IE9+ beucase of `indexOf()`. 

Roadmap
-------

- [x] Graph
- [x] Digraph
- [x] Undirected

###Iterator
- [x] Special Ordenation
- [x] Breadth-First Search
- [ ] Depth-First Search

###Algorithms
- [ ] Chordal checker
- [x] Vertex Coloring
- [x] Lexicographic Breadth-First Search

####Pathfinding
- [ ] A* (unweighted graph)
- [ ] Prim
- [ ] Dijkstra
