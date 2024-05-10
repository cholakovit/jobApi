import express from 'express'
import UserController from '../controllers/UserController'

const userRouter = express.Router()
const userController = new UserController()

userRouter.get('/', userController.listUser)
userRouter.get('/show/:id', userController.showUser)
userRouter.post('/new', userController.newUser)
userRouter.patch('/update/:id', userController.updateUser)
userRouter.delete('/delete/:id', userController.deleteUser)

export default userRouter