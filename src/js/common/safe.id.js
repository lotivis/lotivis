// https://stackoverflow.com/questions/70579/what-are-valid-values-for-the-id-attribute-in-html
// ids must not contain whitespaces
// ids should avoid ".", ":" and "/"

export function safeId(id) {
  return id
    .split(` `)
    .join(`-`)
    .split(`/`)
    .join(`-`)
    .split(`.`)
    .join(`-`)
    .split(`:`)
    .join(`-`);
}
