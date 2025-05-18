class Grafo {
  constructor(direcionado = false) {
    this.listaAdj = new Map();
    this.direcionado = direcionado; // false = não direcionado, true = dígrafo
  }

  adicionarVertice(v) {
    if (!this.listaAdj.has(v)) {
      this.listaAdj.set(v, []);
    }
  }

  adicionarAresta(v, w, peso = 1) {
    if (!this.listaAdj.has(v)) this.adicionarVertice(v);
    if (!this.listaAdj.has(w)) this.adicionarVertice(w);

    // adiciona aresta ponderada
    this.listaAdj.get(v).push({ vertice: w, peso });
    if (!this.direcionado) {
      this.listaAdj.get(w).push({ vertice: v, peso });
    }
  }

  contarLacos() {
    let count = 0;
    for (const [v, vizinhos] of this.listaAdj) {
      count += vizinhos.filter(n => n.vertice === v).length;
    }
    return count;
  }

  completo() {
    const n = this.listaAdj.size;
    for (const [v, vizinhos] of this.listaAdj) {
      const distintos = new Set(
        vizinhos
          .map(n => n.vertice)
          .filter(x => x !== v)
      );
      if (distintos.size !== n - 1) return false;
    }
    return true;
  }

  grauVertice(v) {
    if (!this.listaAdj.has(v)) {
      throw new Error(`Vértice "${v}" não existe`);
    }
    return this.listaAdj.get(v).length;
  }

  encontrarCaminho(inicio, fim) {
    if (!this.listaAdj.has(inicio) || !this.listaAdj.has(fim)) return null;
    const fila = [inicio];
    const visitado = new Set([inicio]);
    const pai = new Map();

    while (fila.length > 0) {
      const v = fila.shift();
      if (v === fim) break;
      for (const { vertice: w } of this.listaAdj.get(v)) {
        if (!visitado.has(w)) {
          visitado.add(w);
          pai.set(w, v);
          fila.push(w);
        }
      }
    }

    if (!visitado.has(fim)) return null;

    const caminho = [];
    let atual = fim;
    while (atual !== undefined) {
      caminho.push(atual);
      atual = pai.get(atual);
    }
    return caminho.reverse();
  }

  // Algoritmo de Dijkstra para grafos ponderados
  dijkstra(inicio) {
    const dist = new Map();
    const prev = new Map();
    const visitado = new Set();

    for (const v of this.listaAdj.keys()) {
      dist.set(v, Infinity);
      prev.set(v, null);
    }
    dist.set(inicio, 0);

    while (visitado.size < this.listaAdj.size) {
      let u = null;
      let minDist = Infinity;
      for (const [v, d] of dist) {
        if (!visitado.has(v) && d < minDist) {
          minDist = d;
          u = v;
        }
      }
      if (u === null) break;
      visitado.add(u);

      for (const { vertice: w, peso } of this.listaAdj.get(u)) {
        if (!visitado.has(w)) {
          const alt = dist.get(u) + peso;
          if (alt < dist.get(w)) {
            dist.set(w, alt);
            prev.set(w, u);
          }
        }
      }
    }

    return { distancias: dist, antecessores: prev };
  }

  menorCaminho(inicio, fim) {
    const { distancias, antecessores } = this.dijkstra(inicio);
    const distancia = distancias.get(fim);
    if (distancia === Infinity) return { caminho: null, distancia: Infinity };

    const caminho = [];
    let v = fim;
    while (v !== null) {
      caminho.push(v);
      v = antecessores.get(v);
    }
    return { caminho: caminho.reverse(), distancia };
  }

  imprimirMenorCaminho(inicio, fim) {
    const { caminho, distancia } = this.menorCaminho(inicio, fim);
    if (!caminho) {
      console.log(`Não há caminho de ${inicio} até ${fim}`);
    } else {
      console.log(
        `Menor caminho de ${inicio} até ${fim}: ${caminho.join(' -> ')} (distância: ${distancia})`
      );
    }
  }

  paraDot() {
    const linhas = ['graph G {'];
    // laços ponderados
    for (const [v, vizinhos] of this.listaAdj) {
      vizinhos
        .filter(n => n.vertice === v)
        .forEach(n => linhas.push(`  "${v}" -- "${v}" [label="${n.peso}"];`));
    }
    // arestas distintas
    const vistos = new Set();
    for (const [v, vizinhos] of this.listaAdj) {
      for (const { vertice: w, peso } of vizinhos) {
        const chave = this.direcionado ? `${v}->${w}` : [v, w].sort().join('|');
        if (!vistos.has(chave)) {
          const op = this.direcionado ? '->' : '--';
          linhas.push(`  "${v}" ${op} "${w}" [label="${peso}"];`);
          vistos.add(chave);
        }
      }
    }
    linhas.push('}');
    return linhas.join('\n');
  }
}

module.exports = Grafo;



/* class Grafo {
  constructor() {
    this.listaAdj = new Map();
  }

  adicionarVertice(v) {
    if (!this.listaAdj.has(v)) {
      this.listaAdj.set(v, []);
    }
  }

  adicionarAresta(v, w) {
    if (!this.listaAdj.has(v)) this.adicionarVertice(v);
    if (!this.listaAdj.has(w)) this.adicionarVertice(w);

    if (v === w) {
      // laço: insere apenas uma vez
      this.listaAdj.get(v).push(v);
    } else {
      this.listaAdj.get(v).push(w);
      this.listaAdj.get(w).push(v);
    }
  }

  contarLacos() {
    let count = 0;
    for (const [v, vizinhos] of this.listaAdj) {
      count += vizinhos.filter(w => w === v).length;
    }
    return count;
  }

  completo() {
    const n = this.listaAdj.size;
    for (const [v, vizinhos] of this.listaAdj) {
      const distintos = new Set(vizinhos.filter(w => w !== v));
      if (distintos.size !== n - 1) return false;
    }
    return true;
  }

  grauVertice(v) {
    if (!this.listaAdj.has(v)) {
      throw new Error(`Vértice "${v}" não existe`);
    }
    return this.listaAdj.get(v).length;
  }

  encontrarCaminho(inicio, fim) {
    if (!this.listaAdj.has(inicio) || !this.listaAdj.has(fim)) return null;
    const fila = [inicio];
    const visitado = new Set([inicio]);
    const pai = new Map();

    while (fila.length > 0) {
      const v = fila.shift();
      if (v === fim) break;
      for (const w of this.listaAdj.get(v)) {
        if (!visitado.has(w)) {
          visitado.add(w);
          pai.set(w, v);
          fila.push(w);
        }
      }
    }

    if (!visitado.has(fim)) return null;

    const caminho = [];
    let atual = fim;
    while (atual !== undefined) {
      caminho.push(atual);
      atual = pai.get(atual);
    }
    return caminho.reverse();
  }

  paraDot() {
    const linhas = ['graph G {'];
    // laços
    for (const [v, vizinhos] of this.listaAdj) {
      const lacos = vizinhos.filter(w => w === v).length;
      for (let i = 0; i < lacos; i++) {
        linhas.push(`  "${v}" -- "${v}";`);
      }
    }
    // arestas distintas
    const vistos = new Set();
    for (const [v, vizinhos] of this.listaAdj) {
      for (const w of vizinhos) {
        if (v < w) {
          const chave = `${v}|${w}`;
          if (!vistos.has(chave)) {
            linhas.push(`  "${v}" -- "${w}";`);
            vistos.add(chave);
          }
        }
      }
    }
    linhas.push('}');
    return linhas.join('\n');
  }
}

module.exports = Grafo; */