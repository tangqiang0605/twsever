const serverHandler = require('./handler/serverHandler');
const { TWSERVER_CONFIG } = require('../workplace/configs/config');
require('http').createServer(serverHandler).listen(TWSERVER_CONFIG.port, () => console.log(`server: twserver is running at port ${TWSERVER_CONFIG.port}`));