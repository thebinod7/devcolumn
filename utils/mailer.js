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
    //Can add swith case instead of if else to choose template base on action.
    if (options.action === "demo") {
      filePath = "../../public/email/demo.hbs"; //Path of an email template.
    }

    // Helper function to read html file.
    const readHTMLFile = (path, callback) => {
      fs.readFile(path, { encoding: "utf-8" }, (err, html) => {
        if (err) {
          callback(err);
        } else {
          callback(null, html);
        }
      });
    };

    // Create trasporter object using nodemailer and credentials.
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
      //Send email with mailOptions created above.
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
