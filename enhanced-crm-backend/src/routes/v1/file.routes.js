const expressFile = require('express');
const fileRouter = expressFile.Router();
const upload = require('../../middlewares/fileValidation.middleware');
const FileController = require('../../controllers/file.controller');
const authFile = require('../../middlewares/permission.middleware');


fileRouter.post('/upload', authFile('files:upload'), upload.single('file'), FileController.uploadFile);
fileRouter.delete('/:id', authFile('files:delete'), FileController.deleteFile);


module.exports = fileRouter;