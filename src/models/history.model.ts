import mongoose, { Document, Schema } from "mongoose";

export interface HistoryDocument extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  weather: mongoose.Types.ObjectId;
  lat: number;
  lon: number;
  requestedAt: Date;
}

const historySchema = new Schema<HistoryDocument>(
  {
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    weather: {
        type: Schema.Types.ObjectId,
        ref: "Weather",
        required: true,
        index: true
    },
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
    requestedAt: {
      type: Date,
      default: Date.now,
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
          user: ret.user,
          weather: ret.weather,
          lat: ret.lat,
          lon: ret.lon,
          requestedAt: ret.requestedAt,
        };
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        return {
          id: ret.id,
          user: ret.user,
          weather: ret.weather,
          lat: ret.lat,
          lon: ret.lon,
          requestedAt: ret.requestedAt,
        };
      },
    },
  }
);

export const HistoryCollection = mongoose.model<HistoryDocument>(
  "History",
  historySchema
);
