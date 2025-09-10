const mongoose = require("mongoose");
const validator = require("validator");

const SiteApiSettingSchema = mongoose.Schema(
  {
    fbPixelId: {
      type: String,
      trim: true,
    },
    redxApiBaseUrl: {
      type: String,
      trim: true,
    },
    redxApiAccessToken: {
      type: String,
      trim: true,
    },
    pathaoApiBaseUrl: {
      type: String,
      trim: true,
    },
    pathaoApiAccessToken: {
      type: String,
      trim: true,
    },
    pathaoApiStoreId: {
      type: String,
      trim: true,
    },
    steadFastApiBaseUrl: {
      type: String,
      trim: true,
    },
    steadFastApiKey: {
      type: String,
      trim: true,
    },
    steadFastSecretKey: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const SiteApiSetting = mongoose.model("SiteApiSetting", SiteApiSettingSchema);

module.exports = SiteApiSetting;
