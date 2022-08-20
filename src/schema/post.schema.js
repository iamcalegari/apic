const jsonSchema = {
  dataHora: {
    type: Date,
    description: "Data e hoje em que o array foi recebido pela API.",
    default: Date.now,
  },
  leitura: {
    type: Number,
    description: "Número da leitura do vetor.",
  },
  tamanho: {
    type: Number,
    description: "Tamanho do array.",
  },
  vetor: {
    type: Array,
    description: "Array com valores comprimidos.",
  },
};

module.exports = { postSchema: jsonSchema };
