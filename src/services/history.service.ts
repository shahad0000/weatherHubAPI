import { HistoryCollection } from "../models/history.model";
import { FilterQuery } from "mongoose";

const historyData = async (
  userId: string,
  query: {
    skip?: string;
    limit?: string;
    sort?: string;
    from?: string;
    to?: string;
    lat?: string;
    lon?: string;
    count?: string;
  }
) => {
  try {
    const {
      skip = "0",
      limit = "10",
      sort = "-requestedAt",
      from,
      to,
      lat,
      lon,
      count,
    } = query;

    const filter: FilterQuery<any> = {
      user: userId,
    };

    if (from || to) {
      filter.requestedAt = {};
      if (from) filter.requestedAt.$gte = new Date(from);
      if (to) filter.requestedAt.$lte = new Date(to);

      if (Object.keys(filter.requestedAt).length === 0) {
        delete filter.requestedAt;
      }
    }
    if (lat) filter.lat = Number(lat);
    if (lon) filter.lon = Number(lon);
    if (count === "true") {
      const total = await HistoryCollection.countDocuments(filter);
      return { total };
    }
    const history = await HistoryCollection.find(filter)
      .sort(sort)
      .skip(Number(skip))
      .limit(Number(limit));

    return history;
  } catch (err) {
    console.error(err);
  }
};

export { historyData };
