const routes = require("express").Router();
const fs = require("fs");
const { resolve } = require("path");
const http = require("http");

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
routes.get("/api/vetores/:id/:index/baixar/:format", async (req, res) => {
  const { vetor: vet } = await Post.findById(req.params.id);

  console.log(vet);

  fs.writeFileSync(
    resolve(
      __dirname,
      "..",
      "..",
      "public",
      `vetor${req.params.index}.${req.params.format}`
    ),
    JSON.stringify(vet),
    "utf-8"
  );

  res.download(
    resolve(
      __dirname,
      "..",
      "..",
      "public",
      `vetor${req.params.index}.${req.params.format}`
    )
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
  // const vetor = vetoresColetados.map((vet) => vet.vetor);

  let urls = [];

  for (let i = 0; i < +req.params.range; i++) {
    process.env.PORT
      ? (urls[i] = {
          url: `https://ic-iot.herokuapp.com/api/vetores/${ids[i]}/${
            i + 1
          }/baixar/${req.params.format}`,
          filename: `vetor${i}.${req.params.format}`,
        })
      : (urls[i] = {
          url: `http://localhost:3000/api/vetores/${ids[i]}/${i + 1}/baixar/${
            req.params.format
          }`,
          filename: `vetor${i}.${req.params.format}`,
        });

    // fs.writeFileSync(
    //   resolve(
    //     __dirname,
    //     "..",
    //     "..",
    //     "public",
    //     `vetor${i}.${req.params.format}`
    //   ),
    //   JSON.stringify(vetor[i]),
    //   "utf-8"
    // );
    // urls[i] = resolve(
    //   __dirname,
    //   "..",
    //   "..",
    //   "public",
    //   `vetor${i}.${req.params.format}`
    // );
  }

  const url = urls.map((vetor) => vetor.url);
  const filename = urls.map((vetor) => vetor.filename);
  const data = {
    url: url,
    filename: filename,
  };
  return res.json(data);

  // urls.forEach((e) => {
  //   fetch(e.url)
  //     .then((res) => res.blob())
  //     .then((blob) => {
  //       saveAs(blob, e.filename);
  //     });
  // });
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
