import mongoose, { Document, Schema } from "mongoose";

export interface WeatherDocument extends Document {
  _id: mongoose.Types.ObjectId;
  lat: number;                                               // rounded(2)
  lon: number;                                              // rounded(2)
  data: mongoose.Schema.Types.Mixed;           // raw OpenWeather JSON
  fetchedAt: Date;                                         // TTL-indexed
}

const weatherSchema = new Schema<WeatherDocument>(
  {
    lat: {
      type: Number,
      required: [true, "Latitude is required"],
      set: (val: number) => Math.round(val * 100) / 100,
    },
    lon: {
      type: Number,
      required: [true, "Longitude is required"],
      set: (val: number) => Math.round(val * 100) / 100,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
    },
    fetchedAt: {
      type: Date,
      default: Date.now,
      expires: 1800,                //TTL, default 30 min
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        return {
          id: ret.id,
          lat: ret.lat,
          lon: ret.lon,
          data: ret.data,
          fetchedAt: ret.fetchedAt,
        };
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        return {
          id: ret.id,
          lat: ret.lat,
          lon: ret.lon,
          data: ret.data,
          fetchedAt: ret.fetchedAt,
        };
      },
    },
  }
);

export const WeatherCollection = mongoose.model<WeatherDocument>(
  "Weather",
  weatherSchema
);
