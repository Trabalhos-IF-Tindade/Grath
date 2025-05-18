const Grafo = require('../Grafo');

describe('Grafo básico', () => {
  let g;
  beforeEach(() => {
    g = new Grafo();
  });

  test('adicionar vértices', () => {
    g.adicionarVertice('A');
    g.adicionarVertice('B');
    expect(g.listaAdj.has('A')).toBe(true);
    expect(g.listaAdj.has('B')).toBe(true);
    expect(g.listaAdj.get('A')).toEqual([]);
  });

  test('adicionar arestas e laços', () => {
    g.adicionarAresta('A', 'B');
    expect(g.listaAdj.get('A')).toContain('B');
    expect(g.listaAdj.get('B')).toContain('A');

    g.adicionarAresta('C', 'C'); // laço
    expect(g.contarLacos()).toBe(1);
  });

  test('contar laços', () => {
    g.adicionarAresta('X', 'X');
    g.adicionarAresta('X', 'X');
    expect(g.contarLacos()).toBe(2);
  });

  test('verificar se é completo', () => {
    ['A', 'B', 'C'].forEach(v => g.adicionarVertice(v));
    g.adicionarAresta('A', 'B');
    g.adicionarAresta('A', 'C');
    g.adicionarAresta('A', 'D');
    g.adicionarAresta('A', 'E');
    g.adicionarAresta('B', 'C');
    g.adicionarAresta('B', 'D');
    g.adicionarAresta('B', 'E');
    g.adicionarAresta('C', 'D');
    g.adicionarAresta('C', 'E');
    g.adicionarAresta('D', 'E');

    expect(g.completo()).toBe(true);

    g.adicionarVertice('G');
    expect(g.completo()).toBe(false);
  });

  test('grau de um vértice', () => {
    g.adicionarAresta('A', 'B');
    g.adicionarAresta('A', 'A');
    expect(g.grauVertice('A')).toBe(2);
    expect(() => g.grauVertice('Z')).toThrow(/não existe/);
  });

  test('encontrar caminho', () => {
    ['A', 'B', 'C', 'D', 'G'].forEach(v => g.adicionarVertice(v));
    g.adicionarAresta('A', 'B');
    g.adicionarAresta('B', 'C');
    g.adicionarAresta('C', 'D');
    g.adicionarAresta('B', 'D');
    g.adicionarAresta('A', 'C');
    g.adicionarAresta('C', 'E');
    g.adicionarAresta('D', 'E');
    expect(g.encontrarCaminho('A', 'D')).toEqual(['A', 'B', 'D']);
    expect(g.encontrarCaminho('A', 'E')).toEqual(['A', 'C', 'E']);
    expect(g.encontrarCaminho('A', 'G')).toBeNull();
    expect(g.encontrarCaminho('A', 'X')).toBeNull();
  });

  test('exportar para DOT', () => {
    g.adicionarAresta('A', 'B');
    g.adicionarAresta('B', 'C');
    g.adicionarAresta('C', 'C'); // laço
    const dot = g.paraDot();
    expect(dot).toMatch(/graph G/);
    expect(dot).toMatch(/"A" -- "B";/);
    expect(dot).toMatch(/"C" -- "C";/);
  });
});
