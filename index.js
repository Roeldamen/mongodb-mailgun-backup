const mailgun = require('mailgun-js')
const mongoose = require('mongoose');
const Schema = mongoose.Schema

class MongoMailBackup {
  constructor(config) {
    this.mongo_uri = config.mongo_uri
    this.mg = mailgun({
      apiKey: config.mailgun_key,
      domain: config.mailgun_domain,
      host: config.mailgun_host
    })
  }

  mongoToMail = (mailgunParams) => {
    mongoose.connect(this.mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .catch(error => {
        console.log(error)
        return error
      });
    mongoose.connection.on('error', err => {
      logError(err);
      return err
    });

    mongoose.connection.on('open', async () => {
      const collections = await mongoose.connection.db.listCollections().toArray()
      const data = await this.#getAllCollections(collections)
      console.log("Number of attachments:", data.length)
      mailgunParams.attachment = data
      const result = await this.mg.messages().send(mailgunParams)
      console.log("Mailgun response:", result)
      mongoose.connection.close()
    })
  }

  #getAllCollections = async (collections) => {
    let data = []
    for (const item of collections) {
      const result = await this.#getCollectionData(item.name)
      data.push(result)
    }
    return data
  }

  #getCollectionData = async (collecionName) => {
    console.log("Creating JSON attachment for", collecionName)
    const ProductSchema = new Schema({}, { strict: false });
    const Product = mongoose.model(collecionName, ProductSchema, collecionName);
    const data = await Product.find({})

    return new this.mg.Attachment({ data: Buffer.from(JSON.stringify(data)), filename: `${collecionName}.json` })
  }
}

module.exports = MongoMailBackup