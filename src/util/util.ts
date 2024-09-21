export function checkEveName(name: string) {
  // name can only contain letters, numbers, and spaces and  underscores and tack (-) and '

  // max length 100
  if (name.length > 100) return false;
  return /^[a-zA-Z0-9-_ ']+$/.test(name);
}