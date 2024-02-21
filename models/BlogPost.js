const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const BlogPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, minLength: 6, maxLength: 20 },
  content: { type: String, required: true, minLength: 10, maxLength: 200 },
  timestamp: {type: Date, required:true}
});

BlogPostSchema.virtual("timestamp_formatted").get(function () {
    return this.timestamp? DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED): '';
});

// Export model
module.exports = mongoose.model("BlogPost", BlogPostSchema);
