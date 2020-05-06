const mongoose = require("mongoose");
const {Schema} = mongoose;

const orderSchema = new Schema ({
    orderedBy: String,
    _product : {type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: {type: Number, required: true},
    dateOrdered: Date
});

mongoose.model('orders', orderSchema);