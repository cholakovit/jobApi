import express from 'express'
import JobController from '../controllers/JobController'
import AuthMiddleware from '../middleware/Authentication'

const jobController = new JobController()
const authMiddleware = new AuthMiddleware()
//const authMiddleware = AuthMiddleware.getInstance();
const jobRouter = express.Router()

jobRouter.get('/', jobController.listJobs)
jobRouter.post('/new', authMiddleware.authenticateJWT, jobController.newJob)
jobRouter.get('/show/:id', jobController.showJob)
jobRouter.patch('/update/:id', authMiddleware.authenticateJWT, jobController.updateJob)
jobRouter.delete('/delete', authMiddleware.authenticateJWT, jobController.deleteJob)

export default jobRouter
