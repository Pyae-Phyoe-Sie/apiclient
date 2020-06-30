var axios = require('axios');

var axiosInstance = axios.create({
  baseURL: 'http://192.168.100.10:8000/api/',
  /* other custom settings */
});

module.exports = axiosInstance;