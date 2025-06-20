import { Request, Response, NextFunction } from "express";
import { OK } from "../utils/http-status";
import { historyData } from "../services/history.service";
import { AuthRequest } from "../middleware/auth.middleware";

const getHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const history = await historyData(userId, req.query);

    res.status(OK).json(history);

  } catch (error) {
    next(error);
  }
};

export { getHistory };
