class GrafoPonderado {
  constructor(direcionado = false) {
    this.listaAdj = new Map();
    this.direcionado = direcionado;
  }

  adicionarVertice(v) {
    if (!this.listaAdj.has(v)) {
      this.listaAdj.set(v, []);
    }
  }

  adicionarAresta(v, w, peso = 1) {
    if (!this.listaAdj.has(v)) this.adicionarVertice(v);
    if (!this.listaAdj.has(w)) this.adicionarVertice(w);
    this.listaAdj.get(v).push({ vertice: w, peso });
    if (!this.direcionado) {
      this.listaAdj.get(w).push({ vertice: v, peso });
    }
  }

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
    if (!distancias.has(fim) || distancias.get(fim) === Infinity) {
      return { caminho: null, distancia: Infinity };
    }
    const caminho = [];
    let v = fim;
    while (v !== null) {
      caminho.push(v);
      v = antecessores.get(v);
    }
    caminho.reverse();
    return { caminho, distancia: distancias.get(fim) };
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
}

module.exports = GrafoPonderado;
