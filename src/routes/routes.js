const routes = require("express").Router();
const fs = require("fs");

const { coletarVetor } = require("../services/coletarVetores");
const Post = require("../models/post.model");

routes.get("/api/vetores/:id/baixar/:format", async (req, res) => {
  const vetorColetado = await Post.findById(req.params.id);

  fs.writeFile(
    `./vetor.${req.params.format}`,
    JSON.stringify(vetorColetado),
    (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    }
  );

  res.download(`./vetor.${req.params.format}`);

  fs.unlink(`./vetor.${req.params.format}`, (err) => {
    if (err) throw err;
  });
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
