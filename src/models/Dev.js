// MVC = Model, View, Controller.
const { Schema, model } = require("mongoose");

// Model = Estrutura da tabela do banco de dados para armezenar um desenvolverdor la dentro.
const DevSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: true
    },
    bio: String,
    avatar: {
      type: String,
      required: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Dev"
      }
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Dev"
      }
    ]
  },
  {
    timestamps: true
    // createdAt, updatedAt
  }
);

// first params = Dev (name of the model), second one = Schema.
module.exports = model("Dev", DevSchema);
