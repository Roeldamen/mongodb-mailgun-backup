const mongoose = require('mongoose');
const Schema = mongoose.Schema

async function getDataFromName(collecionName, mg) {
  console.log("Start creating attachment for " + collecionName)
  const ProductSchema = new Schema({}, { strict: false });
  const Product = mongoose.model(collecionName, ProductSchema, collecionName);
  const data = await Product.find({})

  return new mg.Attachment({ data: Buffer.from(JSON.stringify(data)), filename: `${collecionName}.json` })
}

async function getAllData(collections, mg) {
  console.log("Start getAllData")
  let data = []
  for (const item of collections) {
    const result = await getDataFromName(item.name, mg)
    data.push(result)
  }
  return data
}

module.exports = { getDataFromName, getAllData }