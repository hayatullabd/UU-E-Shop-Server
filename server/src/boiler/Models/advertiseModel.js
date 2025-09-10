const mongoose = require("mongoose");

const AdvertiseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title  is required."],
        },
        image:{
            type:String,
            required:true
        },
      
    },
    {
        timestamps: true,
    }
);

const Advertise = mongoose.model("Advertise", AdvertiseSchema);

module.exports = Advertise;
