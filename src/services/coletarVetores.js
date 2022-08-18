const Post = require("../models/post.model");

const coletarVetor = async () => await Post.find();

module.exports = coletarVetor;
