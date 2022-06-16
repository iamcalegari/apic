const Post = require("../models/post.model");

const coletarVetor = () => Post.find();

module.exports = coletarVetor;
