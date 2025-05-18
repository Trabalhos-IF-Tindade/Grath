const  Grafo  = require('./Grafo.js');

/* let g = new Grafo;
g.adicionarVertice('A');
g.adicionarVertice('B');
g.adicionarVertice('C');
//g.adicionarVertice('D');

g.adicionarAresta('A', 'B');
g.adicionarAresta('B', 'C');
g.adicionarAresta('C', 'A');
g.adicionarAresta('A', 'A');
g.adicionarAresta('C', 'D');
g.adicionarAresta('C', 'E');
g.adicionarAresta('E', 'F');
g.adicionarAresta('F', 'F');

console.log(g);

console.log("LAÇOS",g.contarLacos());

console.log("É completo?",g.completo());

console.log("GRAU",g.grauVertice('A'));

console.log("CAMINHO",g.encontrarCaminho('A','F'));


console.log("CAMINHO",g.paraDot()); */

// main.js

// Exemplo 1: Grafo não direcionado ponderado
function exemploNaoDirecionado() {
  console.log('=== Exemplo: Grafo Não Direcionado Ponderado ===');
  const g = new Grafo(false); // false = não direcionado

  // adiciona vértices indiretamente ao chamar adicionarAresta
  g.adicionarAresta('A', 'B', 4);
  g.adicionarAresta('A', 'C', 2);
  g.adicionarAresta('B', 'C', 1);
  g.adicionarAresta('B', 'D', 5);
  g.adicionarAresta('C', 'D', 8);
  g.adicionarAresta('D', 'E', 3);

  // conta laços (nenhum neste exemplo)
  console.log('Laços:', g.contarLacos());

  // verifica completude
  console.log('É completo?', g.completo());

  // grau de um vértice
  console.log('Grau de C:', g.grauVertice('C'));

  // encontra caminho simples (não ponderado)
  console.log('Caminho A → E (BFS):', g.encontrarCaminho('A', 'E'));

  // imprime o menor caminho ponderado de A até E
  g.imprimirMenorCaminho('A', 'E');
  // → Menor caminho de A até E: A -> C -> B -> D -> E (distância: 10)

  // exporta para DOT com labels de peso
  console.log('\nDOT output:\n', g.paraDot());
}

// Exemplo 2: Dígrafo (direcionado) ponderado
function exemploDigrafo() {
  console.log('\n=== Exemplo: Dígrafo Ponderado ===');
  const dg = new Grafo(true); // true = dígrafo

  dg.adicionarAresta('X', 'Y', 7);
  dg.adicionarAresta('X', 'Z', 3);
  dg.adicionarAresta('Z', 'Y', 1);
  dg.adicionarAresta('Y', 'W', 2);
  dg.adicionarAresta('Z', 'W', 5);

  console.log('Laços:', dg.contarLacos());
  console.log('É completo?', dg.completo());
  console.log('Grau de saída de X:', dg.grauVertice('X'));

  console.log('Caminho X → W (BFS):', dg.encontrarCaminho('X', 'W'));

  dg.imprimirMenorCaminho('X', 'W');
  // → Menor caminho de X até W: X -> Z -> Y -> W (distância: 11)

  console.log('\nDOT output:\n', dg.paraDot());
}

// roda os exemplos
exemploNaoDirecionado();
exemploDigrafo();
