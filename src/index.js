const serverHandler = require('./handler/serverHandler');
const { TWSERVER_CONFIG } = require('../workplace/configs/config');
const path = require('path');
if (TWSERVER_CONFIG.beforeserver) {
  require(path.join(__dirname, '../', TWSERVER_CONFIG.beforeserver))();
}
require('http').createServer(serverHandler).listen(TWSERVER_CONFIG.port||5000, () => {
  console.log(`server: twserver is running at port ${TWSERVER_CONFIG.port||5000}`);
  if (TWSERVER_CONFIG.whenserver) {
    require(path.join(__dirname, '../', TWSERVER_CONFIG.whenserver))();
  }
});