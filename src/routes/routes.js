const routes = require("express").Router();
const fs = require("fs");
const { resolve } = require("path");

const Post = require("../models/post.model");
const split = require("../services/cortar-vetores");
const coletarVetor = require("../services/coletarVetores");

// Rota para cortar os vetores em vetores de tamanho m (m -> compressing factor)
routes.get("/api/vetores/split/:n", async (req, res) => {
  const array = split(+req.params.n);
  return res.json(array);
});

// Rota para cortar uma leitura de vetores em específico
routes.get("/api/vetores/:leitura/split/:m", async (req, res) => {
  const array = split(+req.params.m, +req.params.leitura);
  return res.json(array);
});

// Rota para baixar todos os vetores da lista (DEPRECATED)
/*
routes.get("/api/vetores/:range/baixarall/:format", async (req, res) => {
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
  }

  const url = urls.map((vetor) => vetor.url);
  const filename = urls.map((vetor) => vetor.filename);
  const data = {
    url: url,
    filename: filename,
  };
  return res.json(data);
});
*/

// Rota para listar todos os vetores
routes.get("/api/vetores/coletar", async (req, res) => {
  const vetoresColetados = await coletarVetor();

  return res.json(vetoresColetados);
});

// Rota para listar todos os vetores de uma determinada leitura
routes.get("/api/vetores/coletar/:leitura", async (req, res) => {
  const vetoresColetados = await Post.find({ leitura: req.params.leitura });

  return res.json(vetoresColetados);
});

// Rota para listar todos os ids dos vetores.
routes.get("/api/vetores/coletarid/todas", async (req, res) => {
  let ids = [];
  let leituras = [];
  let tamanhos = [];

  (await coletarVetor()).forEach(
    (vetor, index) =>
      ({
        _id: ids[index],
        leitura: leituras[index],
        tamanho: tamanhos[index],
      } = vetor)
  );

  const data = {
    id: ids,
    tamanho: tamanhos,
    leitura: leituras,
    leituraMax: Math.max(...leituras),
  };
  return res.json(data);
});

// Rota para listar todos os ids dos vetores de uma determinada leitura
routes.get("/api/vetores/coletarid/:leitura", async (req, res) => {
  let ids = [];
  let leituras = [];
  let tamanhos = [];

  (await coletarVetor()).forEach((vetor, index) => {
    if (vetor.leitura <= req.params.leitura) {
      return ({
        _id: ids[index],
        leitura: leituras[index],
        tamanho: tamanhos[index],
      } = vetor);
    }
  });

  const data = {
    id: ids.flat(),
    tamanho: tamanhos.flat(),
    leitura: leituras.flat(),
    leituraMax: +req.params.leitura,
  };
  return res.json(data);
});

// Rota para baixar cada vetor da lista individualmente.
routes.get(
  "/api/vetores/:id/:leitura/:index/baixar/:format",
  async (req, res) => {
    const { vetor: vet } = await Post.findById(req.params.id);

    console.log(vet);

    fs.writeFileSync(
      resolve(
        __dirname,
        "..",
        "..",
        "public",
        `L${req.params.leitura}_vetor${req.params.index}.${req.params.format}`
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
        `L${req.params.leitura}_vetor${req.params.index}.${req.params.format}`
      )
    );
  }
);

// Rota para listar os vetores em um vetor so (DEPRECATED)
/*
routes.get("/api/vetores/coletarall", async (req, res) => {
  const vetoresColetados = await coletarVetor();

  const vetores = vetoresColetados.map((vetor) => vetor.vetor);

  let arr = [];

  vetores.forEach((vetor) => {
    arr = arr.concat(vetor);
  });

  return res.json(arr);
});
*/

// Rota para publicar um vetor com Leitura periodica (DEPRECATED)
/*
routes.post("/api/vetores/publicar/:periodo", async (req, res) => {
  const { vetor } = req.body;
  const dataHora = new Date();
  const ultimoVetor = await Post.findOne({}, {}, { sort: { dataHora: -1 } });
  let umMinuto = new Date();
  umMinuto.setMinutes(umMinuto.getMinutes() + 1);

  let vetores = {};

  if (ultimoVetor) {
    let ultimaDataHora = new Date(ultimoVetor.dataHora);
    ultimaDataHora.setMinutes(
      ultimaDataHora.getMinutes() + Number(req.params.periodo)
    );

    vetores = await Post.create({
      vetor,
      tamanho: vetor.length,
      leitura:
        dataHora <= ultimaDataHora
          ? ultimoVetor.leitura
          : ultimoVetor.leitura + 1,
    });
  } else {
    vetores = await Post.create({
      vetor,
      tamanho: vetor.length,
      leitura: 1,
    });
  }

  return res.json(vetores);
});
*/

// Rota para publicar um vetor com leitura automatica
routes.post("/api/vetores/publicar/auto", async (req, res) => {
  const { vetor, nova_leitura } = req.body;

  const { leitura: ultimaLeitura } = await Post.findOne(
    {},
    {},
    { sort: { dataHora: -1 } }
  );

  if (nova_leitura) {
    const vetores = await Post.create({
      vetor,
      tamanho: vetor.length,
      leitura: ultimaLeitura + 1,
    });

    return res.json(vetores);
  }

  const vetores = await Post.create({
    vetor,
    tamanho: vetor.length,
    leitura: ultimaLeitura,
  });

  return res.json(vetores);
});

// Rota para publicar um vetor com leitura manual
routes.post("/api/vetores/publicar/:leitura", async (req, res) => {
  const { vetor } = req.body;

  vetores = await Post.create({
    vetor,
    tamanho: vetor.length,
    leitura: req.params.leitura,
  });

  return res.json(vetores);
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

// Rota para deletar todos os vetores de uma determinada leitura
routes.delete("/api/vetores/deletar/:leitura", async (req, res) => {
  try {
    const response = await Post.find({ leitura: req.params.leitura });
    for (let i = 0; i < response.length; i++) {
      await Post.findOneAndDelete({ leitura: req.params.leitura });
    }
  } catch (err) {
    console.log(err);
  }

  return res.send();
});

module.exports = routes;
