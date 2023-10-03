const { ProxyAgent } = require('proxy-agent');
const axios = require('axios');

const agent = new ProxyAgent();

const axiosClient = axios.create({
  proxy: false,
  httpsAgent: agent,
  httpAgent: agent,
});

module.exports = {
  agent,
  axiosClient,
};
