let unique = 0;

function next() {
  return "ltv-id-" + unique++;
}

export function create_id() {
  return next();
}
