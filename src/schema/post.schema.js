const jsonSchema = {
  _id: {
    type: Number,
    unique: true,
    index: true,
  },
  dataHora: {
    type: Date,
    description: "Data e hoje em que o array foi recebido pela API.",
    default: Date.now,
  },
  tamanho: {
    type: Number,
    description: "Tamanho do array.",
  },
  vetor: {
    type: Array,
    description: "Array com valores comprimidos",
  },
};

module.exports = { postSchema: jsonSchema };
