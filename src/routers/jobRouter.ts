import express from 'express'
import JobController from '../controllers/JobController'

const jobController = new JobController()
const jobRouter = express.Router()

jobRouter.get('/', jobController.listJobs)
jobRouter.post('/new', jobController.newJob)
jobRouter.get('/show/:id', jobController.showJob)
jobRouter.patch('/update/:id', jobController.updateJob)
jobRouter.delete('/delete', jobController.deleteJob)

export default jobRouter
