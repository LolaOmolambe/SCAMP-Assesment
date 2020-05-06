const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema ({
    name: {type: String, required: true, unique: true},
    description: String,
    startingInventory: {type: Number, required: true},
    inventoryReceived: { type: Number, default: 0 },
    inventoryShipped: { type: Number, default: 0 },
    inventoryOnHand: Number,
    mininumStock: Number,
    dateCreated: Date,
    dateModified: Date
});

mongoose.model('products', productSchema);