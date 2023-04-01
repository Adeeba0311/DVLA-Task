const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

const DVLA_API_URL =
  "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles";
const DVLA_API_KEY = "mG1zaRgSH21lGk5mHwqgV6Y4oGkm8UpX5VNbfHoN"; // Replace with your DVLA API key

app.use(cors()); // Add the CORS middleware

const proxyOptions = {
  target: DVLA_API_URL,
  changeOrigin: true,
  onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader("x-api-key", DVLA_API_KEY);
  },
  pathRewrite: {
    "^/dvla-proxy": "",
  },
};

app.use("/dvla-proxy", createProxyMiddleware(proxyOptions));

app.listen(port, () => {
  console.log(`DVLA Proxy server is running on port ${port}`);
});
