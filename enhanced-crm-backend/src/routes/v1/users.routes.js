const expressUser = require('express');
const userRouter = expressUser.Router();
const UserController = require('../../controllers/user.controller');
const auth = require('../../middlewares/permission.middleware');
const paginate = require('../../middlewares/paginate.middleware');


userRouter.get('/', auth('users:read'), paginate, UserController.getUsers);
userRouter.get('/:id', auth('users:read'), UserController.getUserById);
userRouter.post('/', auth('users:create'), UserController.createUser);
userRouter.put('/:id', auth('users:update'), UserController.updateUser);
userRouter.delete('/:id', auth('users:delete'), UserController.deleteUser);

module.exports = userRouter