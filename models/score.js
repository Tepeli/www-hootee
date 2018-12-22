"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ScoreSchema = new Schema({
    points: { type: Number },
    user: { type: String }
});

// Export model.
module.exports = mongoose.model('Score', ScoreSchema);
