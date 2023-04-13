import http from "http";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile(path.join(__dirname, "public", "index.html"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.url === "/css/style.css") {
    fs.readFile(
      path.join(__dirname, "public", "css", "style.css"),
      (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/css" });
          res.end("Internal Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/css" });
          res.end(data);
        }
      }
    );
  } else if (req.url === "/js/main.js") {
    fs.readFile(
      path.join(__dirname, "public", "js", "main.js"),
      (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/javascript" });
          res.end("Internal Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "application/javascript" });
          res.end(data);
        }
      }
    );
  } else if (req.method === "POST" && req.url === "/send-email") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const formData = JSON.parse(body);
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        secure: true,
      });
      const mailOptions = {
        from: `Eduard <${formData.email}>`,
        to: process.env.EMAIL_RECIPIENT,
        subject: formData.subject,
        text: `Email: ${formData.email} \nMessage: ${formData.message}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        } else {
          console.log("Email sent:", JSON.stringify(info.accepted));
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("Email sent successfully");
        }
      });
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

const PORT = process.env.PORT || 8888;

server.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
