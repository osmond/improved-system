export default function buildChordMatrix(nodes = [], links = []) {
  const index = new Map(nodes.map((n, i) => [n.id, i]));
  const size = nodes.length;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));
  links.forEach((l) => {
    const i = index.get(l.source);
    const j = index.get(l.target);
    if (i != null && j != null) {
      const w = l.weight || 1;
      matrix[i][j] = w;
      matrix[j][i] = w;
    }
  });
  return matrix;
}
