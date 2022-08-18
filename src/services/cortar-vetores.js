const Post = require("../models/post.model");

const split = async (m) => {
  const coletarVetor = await Post.find();

  const vetores = coletarVetor.map((vet) => vet.vetor);

  let arr = [];

  vetores.forEach((vetor) => {
    arr = arr.concat(vetor);
  });

  const arrayCortado = corte(arr, +m);

  try {
    const response = await Post.find();
    for (let i = 0; i < response.length; i++) {
      await Post.findOneAndDelete();
    }
  } catch (err) {
    console.log(err);
  }

  arrayCortado.map(async (vetor) => {
    await Post.create({
      vetor,
    });
  });

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
