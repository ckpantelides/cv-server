var app = require("express")();
var server = require("http").Server(app);

// parsing middleware allows us to read incoming axios data
const bodyParser = require("body-parser");

// CORS middleware allows data to be sent from client-side
var cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;
server.listen(port);
console.log("Server running on port " + port);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// when data received from client-side via axios
app.post("/post", function(req, res) {
  // body-parser saves incoming data in req.body
  const contact = req.body;

  // sendgrid will send email to me with contact details
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: process.env.MY_EMAIL,
    from: "messagefrom@christos.online",
    subject: "New message from christos.online",
    text: contact.name + " " + contact.email + " " + contact.message,
    html:
      contact.name +
      "<br /><br />" +
      contact.email +
      "<br /><br />" +
      contact.message
  };
  sgMail.send(msg);
});

module.exports = app;
