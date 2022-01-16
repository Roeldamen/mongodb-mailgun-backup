# mongodb-mailgun
Sends backup of all collections in mongodb using your mailgun api
# Installation
```
$ npm install mongodb-mailgun
```
# Use
```
const MongoMail = require("mongodb-mailgun")

const mongoBackup = new MongoMail(MAILGUN_KEY, MAILGUN_DOMAIN, MAILGUN_HOST, MONGODB_URL)
const mailgunData = {
  from: "MyBackup hello@yourdomain.com",
  to: "name@yourmail.com",
  subject: 'Title of the backup mail',
  html: "Body of the mail",
}

mongoBackup.getBackupAll(mailgunData)
```