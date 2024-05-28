import express from 'express'
import JobController from '../controllers/JobController'
import AuthMiddleware from '../middleware/Authentication'

const jobController = new JobController()
const authMiddleware = new AuthMiddleware()
const jobRouter = express.Router()

jobRouter.get('/', jobController.listJobs)
jobRouter.post('/new', authMiddleware.checkRole('user'), jobController.newJob)
jobRouter.get('/show/:id', jobController.showJob)
jobRouter.patch('/update/:id', authMiddleware.checkRole('user'), jobController.updateJob)
jobRouter.delete('/delete', authMiddleware.checkRole('user'), jobController.deleteJob)

export default jobRouter
