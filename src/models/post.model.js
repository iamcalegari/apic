const mongoose = require("mongoose");

const { postSchema } = require("../schema/post.schema");

const PostSchema = new mongoose.Schema(postSchema);

module.exports = mongoose.model("Post", PostSchema);
