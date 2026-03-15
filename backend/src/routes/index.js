const express = require('express');
const healthRouter = require('./health.routes');
const messageRoutes = require('./messageRoutes');
const apiRouter = express.Router();

apiRouter.use('/health', healthRouter);
apiRouter.use("/servers",messageRoutes);


module.exports = apiRouter;
