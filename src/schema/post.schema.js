const jsonSchema = {
  dataHora: {
    type: Date,
    description: "Data e hoje em que o array foi recebido pela API.",
    default: Date.now,
  },
  vetor: {
    type: Array,
    description: "Array com valores comprimidos",
  },
};

module.exports = { postSchema: jsonSchema };
