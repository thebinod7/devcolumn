const httpProxy = require("http-proxy");
const fs = require("fs");
const path = require("path");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf8");

let SSL_KEY_PATH = path.join(
  __dirname,
  "../files/41fa7324a5f73595c761b3186bdc6cdfb3fcf18dae267c78a64adb0cf57f9497_sk"
);

const IPFS_HOST = "https://ipfs.deltanetwork.io";
const SSL_CERT_PATH = path.join(__dirname, "../files/cert.pem");
const SSL_CA_PATH = path.join(__dirname, "../files/ipfs-org1-tlsca-cert.pem");
// const { services } = require("../config/local.json");
// let options = {
//   target: services.ipfs.target,
//   secure: false,
//   changeOrigin: true,
//   ssl: {
//     key: services.ipfs.ssl.key,
//     cert: services.ipfs.ssl.cert,
//     ca: services.ipfs.ssl.ca,
//   },
// };

let options = {
  target: IPFS_HOST,
  secure: false,
  changeOrigin: true,
  ssl: {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH),
    ca: fs.readFileSync(SSL_CA_PATH),
  },
};
let proxy = httpProxy.createServer(options);

module.exports = async function Proxy(
  req,
  res,
  { url, method = "POST", adapter },
  cb
) {
  if (!url) {
    cb("url undefined", null);
    return;
  }
  let full_url = `${IPFS_HOST}${url}`;
  req.url = full_url;
  req.method = method.toUpperCase();
  console.log(req.url);
  proxy.web(req, res);
  proxy.on("error", (e) => {
    if (cb) cb(e, null);
  });
  proxy.on("proxyRes", (proxyRes, req, res) => {
    let body = "";
    proxyRes.on("data", function (chunk) {
      body += decoder.write(chunk.toString("base64"));
    });

    proxyRes.on("end", function () {
      body += decoder.end();
      console.log("BODY:", body);
      if (cb) cb(null, JSON.parse(body));
      if (adapter) adapter(body);
    });
  });
};

const Proxy = ({ options }) => {
  return new Promise((resolve, reject) => {
    {
      if (!url) {
        cb("url undefined", null);
        return;
      }
      let full_url = `${IPFS_HOST}${url}`;
      req.url = full_url;
      req.method = method.toUpperCase();
      console.log(req.url);
      proxy.web(req, res);
      proxy.on("error", (e) => {
        if (cb) cb(e, null);
      });
      proxy.on("proxyRes", (proxyRes, req, res) => {
        let body = "";
        proxyRes.on("data", function (chunk) {
          body += decoder.write(chunk.toString("base64"));
        });

        proxyRes.on("end", function () {
          body += decoder.end();
          console.log("BODY:", body);
          resolve(body);
        });
      });
    }
  });
};

module.exports = { Proxy };
