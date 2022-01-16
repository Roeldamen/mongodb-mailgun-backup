const mailgun = require('mailgun-js')
const helpers = require("./helpers")
const mongoose = require('mongoose');

class Mailgun {
  constructor(apiKey, domain, host, mongo_uri) {
    this.apiKey = apiKey;
    this.domain = domain;
    this.host = host;
    this.mongo_uri = mongo_uri
    this.mg = mailgun({
      apiKey: apiKey,
      domain: domain,
      host: host
    })
  }

  getBackupAll = (mailgunData) => {
    const sendMail = this.sendMail
    const mg = this.mg
    mongoose.connect(this.mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('open', function (ref) {
      console.log(this.mg)
      console.log('Connected to mongo server.');
      mongoose.connection.db.listCollections().toArray()
        .then(async function (collections) {
          const data = await helpers.getAllData(collections, mg)
          console.log(data)
          mailgunData.attachment = data
          return sendMail(mailgunData)
        })
        .catch((err) => {
          console.log(err)
          return err
        })
        .finally(() => {
          mongoose.connection.close()
        })
    })
  }

  sendMail = (data) => {
    return new Promise((resolve, reject) => {
      this.mg.messages().send(data, (error, response) => {
        if (error) {
          console.log("got an error: ", error);
          reject(error)
        }
        console.log("Success: ", response)
        resolve(response)
      })
    })
  }
}

module.exports = Mailgun