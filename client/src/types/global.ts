declare global {
  interface String {
    capitalize(): string;
  }
}

String.prototype.capitalize = function () {
  return this.slice(0, 1).toUpperCase() + this.slice(1);
}

export { };