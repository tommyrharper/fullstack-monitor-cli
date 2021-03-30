const fs = require('fs');
const path = require('path');

function getAllLogs() {
  // read all logs from saved files
  const clientLogs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/clientLogs.json'), 'UTF-8'));
  const serverLogs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/serverLogs.json'), 'UTF-8'));
  const requests = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/request.json'), 'UTF-8'));

  if (!clientLogs || !serverLogs) {
    throw Error('helpers: getLogs:  ERROR: Error getting logs data from clientLogs.json and/or serverLog.json file');
  }

  const allLogs = [];

  clientLogs.filter((el) => allLogs.push({
    class: 'client',
    type: el.type,
    timestamp: el.timestamp,
    log: el.arguments[0],
  }));

  serverLogs.filter((el) => allLogs.push({
    class: 'server',
    type: el.type,
    timestamp: el.timestamp,
    log: el.arguments[0],
  }));

  requests.filter((el) => allLogs.push({
    class: 'request',
    timestamp: el.timestamp,
    method: el.method,
    originalUri: el.originalUri,
    uri: el.uri,
    requestData: el.requestData,
    referer: el.referer,
  }));

  requests.filter((el) => allLogs.push({
    class: 'response',
    timestamp: el.timestamp,
    fromIP: el.fromIP,
    responseData: el.responseData,
    responseStatus: el.responseStatus,
  }));

  return allLogs;
}

function storeLogs(type, logs, io) {
  // create an emtpy object to hold all the existing json elements
  let obj = {
    table: [],
  };

  // error handling for if there's no data in req.body
  if (!logs) {
    throw Error('helpers: storeLogs:  ERROR: Error receiving severLogs data from Application');
  }

  // read the existing logs from  json file
  fs.readFile(path.resolve(__dirname, `../data/${type}Logs.json`), 'utf-8', (err, data) => {
    // error handling for reading  the existing file
    if (err) {
      obj = [];
    } else {
      // save all the existing data to exmpty obj
      obj = JSON.parse(data);
    }

    // push the new incoming request data to obj
    obj.push(logs);

    // write object obj that hold all existing data and new requests to request_response json file
    fs.writeFileSync(path.resolve(__dirname, `../data/${type}Logs.json`), JSON.stringify(obj, null, 2), 'UTF-8');

    const logsData = {
      allLogs: getAllLogs()
    };

    // Send via socket.io
    if (io) {
      io.emit('display-logs', logsData);
    }
  });
}

function storeRequests(requests) {
  // create an emtpy object to hold all the existing json elements
  const obj = {
    table: [],
  };

  // if incoming request body is null value, return an error
  if (!requests) {
    throw Error('helpers: storeRequests: ERROR: Error receiving Requests data from Application');
  }

  // read the existing request_respose json file
  // eslint-disable-next-line global-require
  const data = require('../data/request.json');

  // push new requests into data
  data.push(requests);

  // write data that holds existing requests and new request to request.json
  fs.writeFileSync(path.resolve(__dirname, '../data/request.json'), JSON.stringify(data, null, 2), 'UTF-8');
}

module.exports = { getAllLogs, storeLogs, storeRequests };
