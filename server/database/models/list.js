const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
  },
});

const List = mongoose.model("List", ListSchema);

module.exports = List;
