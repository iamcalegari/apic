const routes = require("express").Router();
const fs = require("fs");
const { resolve } = require("path");

const { coletarVetor } = require("../services/coletarVetores");
const Post = require("../models/post.model");

routes.get("/api/vetores/split/:m", async (req, res) => {
  const coletarVetor = await Post.find();

  const vetores = coletarVetor.map((vet) => vet.vetor);

  let arr = [];

  vetores.forEach((vetor) => {
    arr = arr.concat(vetor);
  });

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

  const arrayCortado = corte(arr, +req.params.m);

  try {
    const response = await Post.find();
    for (let i = 0; i < response.length; i++) {
      const posts = await Post.findOneAndDelete();
    }
  } catch (err) {
    console.log(err);
  }

  arrayCortado.map(async (vetor) => {
    await Post.create({
      vetor,
    });
  });

  return res.json(arrayCortado);
});

// Rota para publicar um vetor
routes.post("/api/vetores/publicar", async (req, res) => {
  const { vetor } = req.body;

  const vetores = await Post.create({
    vetor,
  });

  return res.json(vetores);
});

// Rota para baixar cada vetor da lista
routes.get("/api/vetores/:id/baixar/:format", async (req, res) => {
  const { vetor } = await Post.findById(req.params.id);

  console.log(vetor);

  const response = fs.writeFileSync(
    resolve(__dirname, "..", "..", "public", `vetor.${req.params.format}`),
    JSON.stringify(vetor),
    "utf-8"
  );

  res.download(
    resolve(__dirname, "..", "..", "public", `vetor.${req.params.format}`)
  );
}),
  // Rota para baixar todos os vetores da lista
  routes.get("/api/vetores/:range/baixarall/:format", async (req, res) => {
    const coletarVetor = await Post.find();

    const vetores = coletarVetor
      .slice(0, req.params.range)
      .map((vetor) => vetor.vetor);

    let arr = [];

    vetores.forEach((vetor) => {
      arr = arr.concat(vetor);
    });

    const response = fs.writeFileSync(
      resolve(__dirname, "..", "..", "public", `vetor.${req.params.format}`),
      JSON.stringify(arr),
      "utf-8"
    );

    res.download(
      resolve(__dirname, "..", "..", "public", `vetor.${req.params.format}`)
    );
  }),
  // Rota para listar todos os vetores
  routes.get("/api/vetores/coletar", async (req, res) => {
    const coletarVetor = await Post.find();

    return res.json(coletarVetor);
  });

// Rota para listar todos os ids dos vetores
routes.get("/api/vetores/coletarid", async (req, res) => {
  const coletarVetor = await Post.find();
  const ids = coletarVetor.map((vetor) => vetor._id);

  return res.json(ids);
});

// Rota para listar os vetores em um vetor so
routes.get("/api/vetores/coletarall", async (req, res) => {
  const coletarVetor = await Post.find();

  const vetores = coletarVetor.map((vetor) => vetor.vetor);

  let arr = [];

  vetores.forEach((vetor) => {
    arr = arr.concat(vetor);
  });

  return res.json(arr);
});

// Rota para deletar todos os vetores
routes.delete("/api/vetores/deletar", async (req, res) => {
  try {
    const response = await Post.find();
    for (let i = 0; i < response.length; i++) {
      const posts = await Post.findOneAndDelete();
    }
  } catch (err) {
    console.log(err);
  }

  return res.send();
});

module.exports = routes;
