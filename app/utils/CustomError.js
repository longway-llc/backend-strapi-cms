class IdentificationError extends Error {
    constructor(message) {
      super(message);
      this.name = "IdentificationError";
    }
  }

module.exports = IdentificationError
