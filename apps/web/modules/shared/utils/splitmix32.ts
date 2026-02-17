/**
 * High-quality 32-bit PRNG. Pass a seed (e.g. from xmur3).
 * Returns a function that yields values in [0, 1).
 */
export function splitmix32(seed: number): () => number {
  let a = seed | 0;
  return function () {
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}
