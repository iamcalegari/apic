const routes = require("express").Router();
const fs = require("fs");
const { resolve } = require("path");

const { coletarVetor } = require("../services/coletarVetores");
const Post = require("../models/post.model");

routes.get("/api/vetores/:id/baixar", async (req, res) => {
  const { vetor } = await Post.findById(req.params.id);

  console.log(vetor);

  fs.writeFile(
    resolve(__dirname, "..", "..", "public", "vetor.json"),
    JSON.stringify(vetor),
    "utf-8",
    (error, result) => {
      if (error) {
        console.error(error);
      }
      console.log(result);
    }
  );

  res.download(resolve(__dirname, "..", "..", "public", "vetor.json"));

  // fs.unlink(`./vetor.json`, (err) => {
  //   if (err) throw err;
  // });
}),
  routes.post("/api/vetores/publicar", async (req, res) => {
    const { vetor } = req.body;

    const vetores = await Post.create({
      vetor,
    });

    return res.json(vetores);
  });

routes.get("/api/vetores/coletar", async (req, res) => {
  const coletarVetor = await Post.find();

  return res.json(coletarVetor);
});

routes.get("/api/vetores/coletarid", async (req, res) => {
  const coletarVetor = await Post.find();
  const ids = coletarVetor.map((vetor) => vetor._id);

  return res.json(ids);
});

routes.get("/api/vetores/coletarall", async (req, res) => {
  const coletarVetor = await Post.find();

  const vetores = coletarVetor.map((vetor) => vetor.vetor);

  let arr = [];

  vetores.forEach((vetor) => {
    arr = arr.concat(vetor);
  });

  return res.json(arr);
});

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
