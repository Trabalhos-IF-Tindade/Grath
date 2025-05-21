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
      g.adicionarVertice('C');
      g.adicionarVertice('D');
      expect(g.listaAdj.has('A')).toBe(true);
      expect(g.listaAdj.has('B')).toBe(true);
      expect(g.listaAdj.has('C')).toBe(true);
      expect(g.listaAdj.has('D')).toBe(true);
      expect(g.listaAdj.has('E')).toBe(false);
      expect(g.listaAdj.get('A')).toEqual([]);
    });

    test('adicionar arestas não ponderadas', () => {
      g.adicionarAresta('A', 'B');
      g.adicionarAresta('C', 'B');
      g.adicionarAresta('C', 'D');
      g.adicionarVertice('X');
      expect(g.listaAdj.get('A')).toEqual([{ vertice: 'B', peso: 1 }]);
      expect(g.listaAdj.get('B')).toEqual([{ vertice: 'A', peso: 1 }, { vertice: 'C', peso: 1 }]);
      expect(g.listaAdj.get('C')).toEqual([{ vertice: 'B', peso: 1 }, { vertice: 'D', peso: 1 }]);
      expect(g.listaAdj.get('X')).toEqual([]);
    });

    test('adicionar arestas ponderadas', () => {
      g.adicionarAresta('A', 'B', 3);
      g.adicionarAresta('A', 'C', 5);
      g.adicionarAresta('C', 'D', 10);
      g.adicionarAresta('C', 'E', 7);
      expect(g.listaAdj.get('A')).toEqual([
        { vertice: 'B', peso: 3 },
        { vertice: 'C', peso: 5 },
      ]);
      expect(g.listaAdj.get('C')).toEqual([
        { vertice: 'A', peso: 5 },
        { vertice: 'D', peso: 10 },
        { vertice: 'E', peso: 7 },
      ]);
      expect(g.listaAdj.get('B')).toEqual([{ vertice: 'A', peso: 3 }]);
    });

    test('grafo direcionado não adiciona aresta inversa', () => {
      const gDir = new Grafo(true); // Grafo direcionado
      gDir.adicionarAresta('A', 'B', 2);
      gDir.adicionarAresta('A', 'C', 3);
      gDir.adicionarAresta('C', 'A', 5);
      expect(gDir.listaAdj.get('A')).toEqual([{ vertice: 'B', peso: 2 }, { vertice: 'C', peso: 3 }]);
      expect(gDir.listaAdj.get('C')).toEqual([{ vertice: 'A', peso: 5 }]);
      expect(gDir.listaAdj.get('B')).toEqual([]);
    });
  });

  // Testes para métodos específicos
  describe('Métodos do grafo', () => {
    let g;

    beforeEach(() => {
      g = new Grafo();
    });

    test('contar laços', () => {
      g.adicionarAresta('A', 'A', 2);
      g.adicionarAresta('B', 'B', 3);
      expect(g.contarLacos()).toBe(2);
    });

    test('contar laços em grafo maior', () => {
      // três chamadas de laço no mesmo vértice X e um em Y
      g.adicionarAresta('X', 'X', 1);
      g.adicionarAresta('X', 'X', 2);
      g.adicionarAresta('Y', 'Y', 3);
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

    test('verificar grafo completo com múltiplos vértices', () => {
      // cinco vértices completamente conectados
      const verts = ['V1', 'V2', 'V3', 'V4', 'V5'];
      verts.forEach(v => g.adicionarVertice(v));
      for (let i = 0; i < verts.length; i++) {
        for (let j = i + 1; j < verts.length; j++) {
          g.adicionarAresta(verts[i], verts[j]);
        }
      }
      expect(g.completo()).toBe(true);
    });

    test('grau de um vértice', () => {
      g.adicionarAresta('A', 'B');
      g.adicionarAresta('A', 'C');
      g.adicionarAresta('A', 'A');
      expect(g.grauVertice('A')).toBe(3);
      expect(() => g.grauVertice('Z')).toThrow('Vértice "Z" não existe');
    });

    test('grau de vértice com múltiplos loops e arestas', () => {
      g.adicionarAresta('D', 'D');
      g.adicionarAresta('D', 'D');
      g.adicionarAresta('D', 'E');
      expect(g.grauVertice('D')).toBe(3);
    });

    test('encontrar caminho (BFS)', () => {
      g.adicionarAresta('A', 'B');
      g.adicionarAresta('B', 'C');
      g.adicionarAresta('C', 'D');
      g.adicionarAresta('B', 'D');
      expect(g.encontrarCaminho('A', 'D')).toEqual(['A', 'B', 'D']);
      expect(g.encontrarCaminho('A', 'Z')).toBeNull();
    });

    test('encontrar caminho em grafo desconexo', () => {
      ['A', 'B', 'C', 'D'].forEach(v => g.adicionarVertice(v));
      g.adicionarAresta('A', 'B');
      // C e D ficam isolados
      expect(g.encontrarCaminho('A', 'D')).toBeNull();
    });

    test('encontrar caminho BFS em grafo com vários caminhos de mesmo comprimento', () => {
      g.adicionarAresta('A', 'B');
      g.adicionarAresta('A', 'C');
      g.adicionarAresta('B', 'D');
      g.adicionarAresta('C', 'D');
      // Deve escolher sempre o vizinho inserido primeiro (B)
      expect(g.encontrarCaminho('A', 'D')).toEqual(['A', 'B', 'D']);
    });
  });

  describe('Algoritmo de Dijkstra', () => {
    let g;

    beforeEach(() => {
      g = new Grafo(false);
    });

    test('caminho mais curto em grafo não direcionado', () => {
      g.adicionarAresta('A', 'B', 1);
      g.adicionarAresta('A', 'C', 4);
      g.adicionarAresta('B', 'C', 2);
      g.adicionarAresta('B', 'D', 5);
      g.adicionarAresta('C', 'D', 1);
      g.adicionarAresta('A', 'D', 3);

      console.log(g.paraDot())

      const { caminho, distancia } = g.menorCaminho('A', 'D');
      expect(caminho).toEqual(['A', 'D']);
      expect(distancia).toBe(3);
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

    test('menor caminho com múltiplas rotas de mesmo custo', () => {
      g.adicionarAresta('A', 'B', 2);
      g.adicionarAresta('B', 'D', 2);
      g.adicionarAresta('A', 'C', 1);
      g.adicionarAresta('C', 'D', 3);
      const result = g.menorCaminho('A', 'D');
      expect(result.distancia).toBe(4);
      expect(result.caminho[0]).toBe('A');
      expect(result.caminho[result.caminho.length - 1]).toBe('D');
      expect(result.caminho.length).toBe(3);
    });

    test('Dijkstra lança erro para vértice inexistente', () => {
      expect(() => g.dijkstra('Z')).toThrow();
    });

    test('Dijkstra em grafo grande encadeado', () => {
      // cria 50 vértices em cadeia: v0-v1-...-v49
      for (let i = 0; i < 50; i++) {
        g.adicionarVertice(`v${i}`);
        if (i > 0) g.adicionarAresta(`v${i - 1}`, `v${i}`, 1);
      }
      const { caminho, distancia } = g.menorCaminho('v0', 'v49');
      expect(distancia).toBe(49);
      expect(caminho.length).toBe(50);
    });
  });

  describe('Exportação para DOT', () => {
    let g;

    beforeEach(() => {
      g = new Grafo(false);
    });

    test('gera representação DOT correta', () => {
      g.adicionarAresta('A', 'B', 3);
      g.adicionarAresta('B', 'C', 2);
      g.adicionarAresta('A', 'A', 1); // laço
      g.adicionarVertice('D');
      const dot = g.paraDot();

      expect(dot).toContain('graph G {');
      expect(dot).toContain('"A" -- "B" [weight="3", label="3"];');
      expect(dot).toContain('"A" -- "A" [weight="1", label="1"];');
      expect(dot).toMatch(/"D";/); // vértice isolado
    });

    test('gera DOT para grafo direcionado', () => {
      const gDir = new Grafo(true);
      gDir.adicionarAresta('A', 'B', 2);
      const dot = gDir.paraDot();
      expect(dot).toContain('"A" -> "B" [weight="2", label="2"];');
      expect(dot.startsWith('digraph')).toBe(true);
    });

    test('DOT inclui múltiplos vértices isolados e arestas pesadas', () => {
      [ 'X', 'Y', 'Z'].forEach(v => g.adicionarVertice(v));
      g.adicionarAresta('X', 'Y', 10);
      g.adicionarAresta('Y', 'Z', 20);
      const dot = g.paraDot();
      ['"X";', '"Y";', '"Z";'].forEach(str => expect(dot).toContain(str));
      expect(dot).toContain('"X" -- "Y" [weight="10", label="10"];');
      expect(dot).toContain('"Y" -- "Z" [weight="20", label="20"];');
    });
  });

  describe('Casos extremos', () => {
    let g;

    beforeEach(() => {
      g = new Grafo();
    });

    test('grafo vazio', () => {
      expect(g.listaAdj.size).toBe(0);
      expect(g.contarLacos()).toBe(0);
      expect(g.completo()).toBe(true);
      expect(() => g.grauVertice('A')).toThrow();
    });

    test('peso negativo lança erro', () => {
      expect(() => g.adicionarAresta('A', 'B', -1)).toThrow();
    });

    test('arestas de peso zero não são permitidas', () => {
      g.adicionarAresta('A', 'B', 0);
      expect(g.completo()).toBe(true);
      expect(g.contarLacos()).toBe(0);
      expect(g.grauVertice('A')).toBe(1);
    });

    test('muitos vértices e arestas não causam travamento', () => {
      // adiciona 100 vértices e 500 arestas aleatórias
      for (let i = 0; i < 100; i++) {
        g.adicionarVertice(`n${i}`);
      }
      for (let i = 0; i < 500; i++) {
        const u = `n${Math.floor(Math.random() * 100)}`;
        const v = `n${Math.floor(Math.random() * 100)}`;
        g.adicionarAresta(u, v, 1);
      }
      // simplesmente verifica se não lançou
      expect(g.listaAdj.size).toBe(100);
    });
  });
});