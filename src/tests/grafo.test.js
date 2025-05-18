const Grafo = require('../Grafo');

describe('Grafo', () => {
  let g;
  beforeEach(() => {
    g = new Grafo(); // Grafo não direcionado por padrão
  });

  // Testes básicos de estrutura
  describe('Operações básicas', () => {
    test('adicionar vértices', () => {
      g.adicionarVertice('A');
      g.adicionarVertice('B');
      expect(g.listaAdj.has('A')).toBe(true);
      expect(g.listaAdj.has('B')).toBe(true);
      expect(g.listaAdj.get('A')).toEqual([]);
    });

    test('adicionar arestas não ponderadas', () => {
      g.adicionarAresta('A', 'B');
      expect(g.listaAdj.get('A')).toEqual([{ vertice: 'B', peso: 1 }]);
      expect(g.listaAdj.get('B')).toEqual([{ vertice: 'A', peso: 1 }]);
    });

    test('adicionar arestas ponderadas', () => {
      g.adicionarAresta('A', 'B', 3);
      g.adicionarAresta('A', 'C', 5);
      expect(g.listaAdj.get('A')).toEqual([
        { vertice: 'B', peso: 3 },
        { vertice: 'C', peso: 5 },
      ]);
      expect(g.listaAdj.get('B')).toEqual([{ vertice: 'A', peso: 3 }]);
    });

    test('grafo direcionado não adiciona aresta inversa', () => {
      const gDir = new Grafo(true); // Grafo direcionado
      gDir.adicionarAresta('A', 'B', 2);
      expect(gDir.listaAdj.get('A')).toEqual([{ vertice: 'B', peso: 2 }]);
      expect(gDir.listaAdj.get('B')).toEqual([]);
    });
  });

  // Testes para métodos específicos
  describe('Métodos do grafo', () => {
    test('contar laços', () => {
      g.adicionarAresta('A', 'A', 2);
      g.adicionarAresta('B', 'B', 3);
      expect(g.contarLacos()).toBe(2);
    });

    test('verificar grafo completo', () => {
      ['A', 'B', 'C'].forEach(v => g.adicionarVertice(v));
      g.adicionarAresta('A', 'B');
      g.adicionarAresta('A', 'C');
      g.adicionarAresta('B', 'C');
      expect(g.completo()).toBe(true);

      g.adicionarVertice('D');
      expect(g.completo()).toBe(false);
    });

    test('grau de um vértice', () => {
      g.adicionarAresta('A', 'B');
      g.adicionarAresta('A', 'C');
      g.adicionarAresta('A', 'A');
      expect(g.grauVertice('A')).toBe(3);
      expect(() => g.grauVertice('Z')).toThrow('Vértice "Z" não existe');
    });

    test('encontrar caminho (BFS)', () => {
      g.adicionarAresta('A', 'B');
      g.adicionarAresta('B', 'C');
      g.adicionarAresta('C', 'D');
      g.adicionarAresta('B', 'D');
      expect(g.encontrarCaminho('A', 'D')).toEqual(['A', 'B', 'D']);
      expect(g.encontrarCaminho('A', 'Z')).toBeNull();
    });
  });

  // Testes para Dijkstra e caminhos mínimos
  describe('Algoritmo de Dijkstra', () => {
    test('caminho mais curto em grafo não direcionado', () => {
      g.adicionarAresta('A', 'B', 1);
      g.adicionarAresta('A', 'C', 4);
      g.adicionarAresta('B', 'C', 2);
      g.adicionarAresta('B', 'D', 5);
      g.adicionarAresta('C', 'D', 1);

      const { caminho, distancia } = g.menorCaminho('A', 'D');
      expect(caminho).toEqual(['A', 'B', 'C', 'D']);
      expect(distancia).toBe(4);
    });

    test('caminho mais curto em grafo direcionado', () => {
      const gDir = new Grafo(true);
      gDir.adicionarAresta('A', 'B', 1);
      gDir.adicionarAresta('B', 'C', 2);
      gDir.adicionarAresta('A', 'C', 4);
      gDir.adicionarAresta('C', 'D', 1);

      const { caminho, distancia } = gDir.menorCaminho('A', 'D');
      expect(caminho).toEqual(['A', 'B', 'C', 'D']);
      expect(distancia).toBe(4);
    });

    test('vértice inalcançável retorna Infinity', () => {
      g.adicionarAresta('A', 'B', 1);
      g.adicionarVertice('C'); // C não tem conexões
      const { caminho, distancia } = g.menorCaminho('A', 'C');
      expect(caminho).toBeNull();
      expect(distancia).toBe(Infinity);
    });

    test('Dijkstra com vértice inexistente lança erro', () => {
      expect(() => g.dijkstra('Z')).toThrow();
    });
  });

  // Testes para exportação DOT
  describe('Exportação para DOT', () => {
    test('gera representação DOT correta', () => {
      g.adicionarAresta('A', 'B', 3);
      g.adicionarAresta('B', 'C', 2);
      g.adicionarAresta('A', 'A', 1); // laço
      g.adicionarVertice('D');
      const dot = g.paraDot();
      
      expect(dot).toContain('graph G {');
      expect(dot).toContain('"A" -- "B" [label="3"];');
      expect(dot).toContain('"A" -- "A" [label="1"];');
    });

    test('gera DOT para grafo direcionado', () => {
      const gDir = new Grafo(true);
      gDir.adicionarAresta('A', 'B', 2);
      const dot = gDir.paraDot();
      expect(dot).toContain('"A" -> "B" [label="2"];');
      console.log(dot)
    });
  });

  // Testes de robustez
  describe('Casos extremos', () => {
    test('grafo vazio', () => {
      expect(g.listaAdj.size).toBe(0);
      expect(g.contarLacos()).toBe(0);
      expect(g.completo()).toBe(true);
      expect(() => g.grauVertice('A')).toThrow()
    });

    test('peso negativo lança erro', () => {
      expect(() => g.adicionarAresta('A', 'B', -1)).toThrow();
    });
  });
});