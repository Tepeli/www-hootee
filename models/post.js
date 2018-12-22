"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
    teksti: { type: String },
    user: { type: String }
});

// Export model.
module.exports = mongoose.model('Post', PostSchema);
