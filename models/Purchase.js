const mongoose = require("mongoose");
const {Schema} = mongoose;

const purchaseSchema = new Schema ({
    _product: {type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: {type: Number, required: true},
    datePurchased: Date,
    _supplier : {type: Schema.Types.ObjectId, ref: 'Supplier'}
});

mongoose.model('purchases', purchaseSchema);