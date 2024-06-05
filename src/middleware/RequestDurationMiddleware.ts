import { Request, Response, NextFunction } from "express";
import { requestDuration } from "../helper/histograms";

class RequestDurationMiddleware {
  handle(req: Request, res: Response, next: NextFunction): void {
    const end = requestDuration.startTimer()

    res.on('finish', () => {
      end({ method: req.method, endpoint: req.originalUrl, status_code: res.statusCode })
    })

    next()
  }
}

export default RequestDurationMiddleware