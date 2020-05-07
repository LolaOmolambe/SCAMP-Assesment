const mongoose = require("mongoose");
const {Schema} = mongoose;

const purchaseSchema = new Schema ({
    _product: {type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: {type: Number, required: true},
    datePurchased: Date
});

mongoose.model('purchases', purchaseSchema);