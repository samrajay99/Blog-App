const express = require('express');
const { register,login ,getUser,getAuthors, changeAvtar,editUser} = require('../controllers/userController');
const { userMiddleware, } = require('../middlewares/userMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');


const userRouter = express.Router();

userRouter.post('/register',userMiddleware,register);
userRouter.post('/login', login);
userRouter.get('/:id', getUser);
userRouter.get('/', getAuthors);
userRouter.post('/change-avatar',authMiddleware,changeAvtar);
userRouter.patch('/edit-user/',authMiddleware, editUser);



module.exports = {userRouter};