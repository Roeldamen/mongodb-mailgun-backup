# mongodb-mailgun-backup
Sends a backup of all collections in a mongodb using mailgun.

# Installation
```
$ npm install mongodb-mailgun-backup
```
# Use
```
const MongoMail = require("mongodb-mailgun-backup")
require('dotenv').config();

const config = {
  mailgun_key: process.env.MAILGUN_KEY,
  mailgun_domain: process.env.MAILGUN_DOMAIN,
  mailgun_host: process.env.MAILGUN_HOST,
  mongo_uri: process.env.MONGODB_URI
}

const backupClient = new MongoMail(config)
let mailgunParams = {
  from: "YourApp your@email.com",   // Make sure this email is whitelisted in Mailgun
  to: "receiver@email.com",         // Email of the receiver
  subject: 'Whatever you want',     // Subject of the email
  html: "This is a simple test",    // Body of the email
}

backupClient.mongoToMail(mailgunParams)
```
The method doesn't return anything, but the progress is logged.
# Todo
* Add/improve error handling
* Allow for mailing without Mailgun account
* Allow for selecting a subset of collections to be backed up