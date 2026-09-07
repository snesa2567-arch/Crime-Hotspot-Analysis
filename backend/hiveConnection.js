const { HiveClient, TCLIService, TCLIService_types } = require('hive-driver');

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);

module.exports = client;