const Post = require("../models/post.model");

const split = async (m, l = null) => {
  let coletarVetor;
  let vetores = [];
  let arrayCortado = [];

  if (l) {
    coletarVetor = await Post.find({ leitura: l });

    let arr = [];

    coletarVetor.forEach((vetor) => {
      arr = arr.concat(vetor.vetor);
    });

    arrayCortado = corte(arr, m, l);

    try {
      const response = coletarVetor;
      for (let i = 0; i < response.length; i++) {
        await Post.findOneAndDelete({ leitura: l });
      }
    } catch (err) {
      console.log(err);
    }

    arrayCortado.map(async (vetor) => {
      await Post.create({
        vetor,
        tamanho: vetor.length,
        leitura: l,
      });
    });
  } else {
    coletarVetor = await Post.find();

    const leituras = coletarVetor.map((vetor) => vetor.leitura);
    const leituraMax = Math.max(...leituras);

    for (let i = 1; i <= leituraMax; i++) {
      vetores[i - 1] = coletarVetor
        .map((vet) => {
          return vet.leitura === i ? vet.vetor : null;
        })
        .filter((vet) => vet !== null);
    }

    let arr = Array(leituraMax).fill([]);

    for (let i = 1; i <= leituraMax; i++) {
      vetores[i - 1].forEach((vetor) => {
        arr[i - 1] = arr[i - 1].concat(vetor);
      });
    }

    for (let i = 1; i <= leituraMax; i++) {
      arrayCortado[i - 1] = corte(arr[i - 1], m);
    }

    try {
      const response = await Post.find();
      for (let i = 0; i < response.length; i++) {
        await Post.findOneAndDelete();
      }
    } catch (err) {
      console.log(err);
    }

    for (let i = 1; i <= leituraMax; i++) {
      arrayCortado[i - 1].map(async (vetor) => {
        await Post.create({
          vetor,
          tamanho: vetor.length,
          leitura: i,
        });
      });
    }
  }

  return arrayCortado;
};

const corte = (array, index, l = null) => {
  const numeroVetores = Math.ceil(array.length / index);
  let arrayCortado = Array(numeroVetores).fill(0);
  let indexLimite = index;
  let inicio = 0;

  if (l) {
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
  } else {
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
  }

  return arrayCortado;
};

module.exports = split;
