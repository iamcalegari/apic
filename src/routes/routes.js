const routes = require("express").Router();
const fs = require("fs");
const { resolve } = require("path");

const download = require("download");

const Post = require("../models/post.model");
const split = require("../services/cortar-vetores");
const coletarVetor = require("../services/coletarVetores");

routes.get("/api/vetores/split/:m", async (req, res) => {
  const array = split(req.params.m);
  return res.json(array);
});

// Rota para publicar um vetor
routes.post("/api/vetores/publicar", async (req, res) => {
  const { vetor } = req.body;

  const vetores = await Post.create({
    vetor,
    tamanho: vetor.length,
  });

  return res.json(vetores);
});

// Rota para baixar cada vetor da lista
routes.get("/api/vetores/:id/baixar/:format", async (req, res) => {
  const { vetor } = await Post.findById(req.params.id);

  console.log(vetor);

  fs.writeFileSync(
    resolve(__dirname, "..", "..", "public", `vetor.${req.params.format}`),
    JSON.stringify(vetor),
    "utf-8"
  );

  res.download(
    resolve(__dirname, "..", "..", "public", `vetor.${req.params.format}`)
  );
});

// Rota para baixar todos os vetores da lista
routes.get("/api/vetores/:range/baixarall/:format", async (req, res) => {
  // const vetoresColetados = await coletarVetor();
  // const vetores = vetoresColetados
  //   .slice(0, req.params.range)
  //   .map((vetor) => vetor.vetor);
  // let arr = [];

  // vetores.forEach((vetor) => {
  //   arr = arr.concat(vetor);
  // });

  // fs.writeFileSync(
  //   resolve(__dirname, "..", "..", "public", `vetor.${req.params.format}`),
  //   JSON.stringify(arr),
  //   "utf-8"
  // );

  // res.download(
  //   resolve(__dirname, "..", "..", "public", `vetor.${req.params.format}`)
  // );

  const vetoresColetados = await coletarVetor();
  const ids = vetoresColetados.map((vetor) => vetor._id);
  let urls = Array(+req.params.range).fill(0);

  for (let i = 0; i < +req.params.range; i++) {
    urls[
      i
    ] = `https://ic-iot.herokuapp.com/api/vetores/${ids[i]}/baixar/${req.params.format}`;
  }

  console.log(urls);

  (async () => {
    await Promise.all(
      urls.map((url, index) =>
        download(url, `./vetor${index}.${req.params.format}`)
      )
    );
    console.log("Images downloaded");
  })();

  res.status(200).send("Downloading...");
});

// Rota para listar todos os vetores
routes.get("/api/vetores/coletar", async (req, res) => {
  const vetoresColetados = await coletarVetor();

  return res.json(vetoresColetados);
});

// Rota para listar todos os ids dos vetores
routes.get("/api/vetores/coletarid", async (req, res) => {
  const vetoresColetados = await coletarVetor();
  const ids = vetoresColetados.map((vetor) => vetor._id);
  const tamanhos = vetoresColetados.map((vetor) => vetor.tamanho);
  const data = {
    id: ids,
    tamanho: tamanhos,
  };
  return res.json(data);
});

// Rota para listar os vetores em um vetor so
routes.get("/api/vetores/coletarall", async (req, res) => {
  const vetoresColetados = await coletarVetor();

  const vetores = vetoresColetados.map((vetor) => vetor.vetor);

  let arr = [];

  vetores.forEach((vetor) => {
    arr = arr.concat(vetor);
  });

  return res.json(arr);
});

// Rota para deletar todos os vetores
routes.delete("/api/vetores/deletar", async (req, res) => {
  try {
    const response = await coletarVetor();
    for (let i = 0; i < response.length; i++) {
      const posts = await Post.findOneAndDelete();
    }
  } catch (err) {
    console.log(err);
  }

  return res.send();
});

module.exports = routes;
