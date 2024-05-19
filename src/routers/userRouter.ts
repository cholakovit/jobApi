import express from 'express'
import UserController from '../controllers/UserController'
import AuthMiddleware from '../middleware/Authentication'

const userRouter = express.Router()
const userController = new UserController()
const authMiddleware = new AuthMiddleware()

userRouter.get('/', authMiddleware.checkRole('admin'), userController.listUser)
userRouter.get('/show/:id', authMiddleware.checkRole('admin'), userController.showUser)
userRouter.post('/new', authMiddleware.checkRole('admin'), userController.newUser)
userRouter.patch('/update/:id', authMiddleware.checkRole('admin'), userController.updateUser)
userRouter.delete('/delete/:id', authMiddleware.checkRole('admin'), userController.deleteUser)

export default userRouter