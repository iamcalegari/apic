const Post = require("../models/post.model");

const split = async (m) => {
  const coletarVetor = await Post.find();
  const ultimoVetor = await Post.findOne({}, {}, { sort: { dataHora: -1 } });

  let vetores = [];

  for (let i = 1; i <= ultimoVetor.leitura; i++) {
    vetores[i - 1] = coletarVetor
      .map((vet) => {
        return vet.leitura === i ? vet.vetor : null;
      })
      .filter((vet) => vet !== null);
  }

  let arr = Array(ultimoVetor.leitura).fill([]);

  for (let i = 1; i <= ultimoVetor.leitura; i++) {
    vetores[i - 1].forEach((vetor) => {
      arr[i - 1] = arr[i - 1].concat(vetor);
    });
  }

  let arrayCortado = [];

  for (let i = 1; i <= ultimoVetor.leitura; i++) {
    arrayCortado[i - 1] = corte(arr[i - 1], +m);
  }

  try {
    const response = await Post.find();
    for (let i = 0; i < response.length; i++) {
      await Post.findOneAndDelete();
    }
  } catch (err) {
    console.log(err);
  }

  for (let i = 1; i <= ultimoVetor.leitura; i++) {
    arrayCortado[i - 1].map(async (vetor) => {
      await Post.create({
        vetor,
        tamanho: vetor.length,
        leitura: i,
      });
    });
  }

  return arrayCortado;
};

const corte = (array, index) => {
  const numeroVetores = Math.ceil(array.length / index);
  let arrayCortado = Array(numeroVetores).fill(0);
  let indexLimite = index;
  let inicio = 0;

  for (let i = 0; i < numeroVetores; i++) {
    arrayCortado[i] = [];
    for (let j = inicio; j < inicio + index; j++) {
      if (j < array.length) {
        arrayCortado[i].push(array[j]);
      }
    }
    inicio = indexLimite;
    indexLimite += index;
  }
  return arrayCortado;
};

module.exports = split;
