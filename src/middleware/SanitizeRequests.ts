import DOMPurify from "dompurify";
import { NextFunction, Request, Response } from "express";


class SanitizeRequests {
  async sanitizeRequestBody(req: Request, res: Response, next: NextFunction) {
    if(req.body && typeof req.body === 'object') {
      Object.keys(req.body).forEach((key) => {
        if(typeof req.body[key] === 'string') {
          req.body[key] = DOMPurify.sanitize(req.body[key])
        }
      })
    }

    if(req.query) {
      Object.keys(req.query).forEach((key) => {
        const value = req.query[key]
        if(typeof value === 'string') {
          req.query[key] = DOMPurify.sanitize(value)
        } else if(Array.isArray(value)) {
          req.query[key] = value.map((item) => typeof item === 'string' ? DOMPurify.sanitize(item) : item) as string[]
        }
      })
    }
    next()
  }
}

export default SanitizeRequests