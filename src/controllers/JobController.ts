import { NextFunction, Request, Response } from "express";
import JobService from "../services/JobService";
import { StatusCodes } from "http-status-codes";
import ApiError from "../helper/ApiError";
import { IJobController } from "../../types";

class JobController implements IJobController {
  listJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const jobs = await JobService.listJobs();
    if (jobs.length === 0) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Jobs not found'));
    }
    res.status(StatusCodes.OK).send({ jobs, count: jobs.length });
  };

  newJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const job = await JobService.createJob(req);
    res.status(StatusCodes.CREATED).json({ job });
  };

  showJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const job = await JobService.showJob(id);
    if (!job) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Job not found'));
    }
    res.status(StatusCodes.OK).json({ job });
  };

  updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const job = await JobService.updateJob(req.params.id, req.body);
    if (!job) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Job not found'));
    }
    res.status(StatusCodes.OK).json({ job });
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const job = await JobService.deleteJob(req.params.id);
    if (!job) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Job not found'));
    }
    res.status(StatusCodes.OK).json({ job });
  };
}

export default JobController;