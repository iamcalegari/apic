const routes = require("express").Router();
const { coletarVetor } = require("../services/coletarVetores");
const Post = require("../models/post.model");

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

routes.delete("/api/vetores/deletar", async (req, res) => {
  const post = await Post.find();

  await post.remove();

  return res.send();
});

module.exports = routes;
