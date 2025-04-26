var express = require("express");
var dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

var admin = require("firebase-admin");
dotenv.config();

let credentials = {
  type: process.env.ADMIN_TYPE,
  project_id: process.env.ADMIN_PROJECT_ID,
  private_key_id: process.env.ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.ADMIN_PRIVATE_KEY
    ? process.env.ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined,
  client_email: process.env.ADMIN_CLIENT_EMAIL,
  client_id: process.env.ADMIN_CLIENT_ID,
  auth_uri: process.env.ADMIN_AUTH_URI,
  token_uri: process.env.ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.ADMIN_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 5000;

app.get("/topic", async (req, res) => {
  const payload = {
    notification: {
      title: "New news",
      body: "2:45",
    },
  };

  await admin
    .messaging()
    .sendToTopic("topic", payload)
    .then((response) => console.log(response))
    .catch((err) => console.log("err", err));

  res.send("Hello World!");
});

app.post("/", async (req, res) => {
  const token = req.body.token;
  const title = req.body.title;
  const body = req.body.body;

  const message = {
    message: {
      token,
      notification: {
        title,
        body
      },
    }
  };

  await admin
    .messaging().send(message.message)
    .then((response) => console.log(response))
    .catch((err) => console.log("err", err));

  res.send("Notificacion enviada");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
