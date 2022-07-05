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

routes.get("/api/vetores/coletarall", async (req, res) => {
  const coletarVetor = await Post.find();

  const vetores = coletarVetor.map((vetor) => vetor.vetor);

  return res.json(vetores);
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
