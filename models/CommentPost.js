const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 20 },
  comment: { type: String, required: true, minLength: 3, maxLength: 200 },
  parentPost: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost", required: true },
  timestamp: {type: Date, required:true}
});

CommentSchema.virtual("timestamp_formatted").get(function () {
    return this.timestamp? DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED): '';
});

// Export model
module.exports = mongoose.model("Comment", CommentSchema);
