import { Request, Response, NextFunction } from "express";
import { OK } from "../utils/http-status";
import { weatherData } from "../services/weather.service";
import { WeatherCollection } from "../models/weather.model";
import { HistoryCollection } from "../models/history.model";

const getWeather = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    const user = (req as any).user;

    let weather = await WeatherCollection.findOne({ lat, lon });
    let source = "cache"
    
    // if no fresh weather data is found get it from the API. 
    if (!weather) {
      const data = await weatherData(lat, lon);
      // Sore to weather collection
      weather = await WeatherCollection.create({
        lat,
        lon,
        data,
        fetchedAt: new Date(),
      });
      source = "api"
    }

    // Log weather to history collection
    await HistoryCollection.create({
      user: user._id,
      weather: weather._id,
      lat,
      lon,
      requestedAt: new Date(),
    });

    // Return weather
    res.status(OK).json({
        ...weather.toObject(),
        source,
    });
  } catch (error) {
    next(error);
  }
};

export { getWeather };
