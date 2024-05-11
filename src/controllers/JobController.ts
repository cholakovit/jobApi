import { NextFunction, Request, Response } from "express";
import jobsSchema from "../schemas/jobsSchema";
import { StatusCodes } from "http-status-codes";
import ApiError from "../helper/ApiError";
import { IJobController } from "../../types";

class JobController implements IJobController {
  listJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jobs = await jobsSchema.find()
      if(jobs.length === 0) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'Jobs not found'));
      }
      res.status(StatusCodes.OK).send({ jobs, count: jobs.length })
    } catch(error) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred: ${(error as Error).message}`));
    }
  }

  newJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const job = await jobsSchema.create(req.body)
      res.status(StatusCodes.CREATED).json({ job })
    } catch(error) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred: ${(error as Error).message}`));
    }
  }

  showJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    try {
      const job = await jobsSchema.findById(id)
      if(!job) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'Job not found'));
      }
      res.status(StatusCodes.OK).json({ job })
    } catch(error) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred: ${(error as Error).message}`));
    }
  }

  updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const job = await jobsSchema.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if(!job) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'Job not found'));
      }
      res.status(StatusCodes.OK).json({ job })
    } catch(error) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred: ${(error as Error).message}`));
    }
  }


  deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const job = await jobsSchema.findByIdAndDelete(req.params.id)
      if(!job) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'Job not found'));
      }
      res.status(StatusCodes.OK).json({ job })
    } catch(error) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error Occurred: ${(error as Error).message}`));
    }
  }
}

export default JobController



