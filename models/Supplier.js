const mongoose = require("mongoose");
const {Schema} = mongoose;

const supplierSchema = new Schema ({
    name: String
});

mongoose.model('suppliers', supplierSchema);