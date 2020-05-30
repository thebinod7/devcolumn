const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const config = require("config");

const app_url = config.get("app_url");
const USERNAME = "YOUREMAIL@gmail.com"; //Sender email address
const PASSWORD = "YOURPASSWORD";

handlebars.registerHelper("app_url", () => app_url);

let filePath;

const send = (options) => {
  new Promise((resolve, reject) => {
    if (options.action === "demo") {
      filePath = "../../public/email/demo.hbs";
    }

    const readHTMLFile = (path, callback) => {
      fs.readFile(path, { encoding: "utf-8" }, (err, html) => {
        if (err) {
          callback(err);
        } else {
          callback(null, html);
        }
      });
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: USERNAME,
        pass: PASSWORD,
      },
    });

    readHTMLFile(path.join(__dirname + filePath), (err, html) => {
      let template = handlebars.compile(html);
      let htmlToSend = template(options.data);
      let mailOptions = {
        from: USERNAME,
        to: `${options.sendTo}`,
        subject: options.subject || "No subject sent!",
        html: htmlToSend,
      };
      transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  });
};

module.exports = { send };
