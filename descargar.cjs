const fs = require("fs");
const https = require("https");

if (!fs.existsSync("./plants")) fs.mkdirSync("./plants");

for (let i = 1; i <= 60; i++) {
  const url = `https://source.unsplash.com/400x300/?plant&sig=${i}`;
  const file = fs.createWriteStream(`./plants/plant${i}.jpg`);

  https.get(url, (response) => {
    response.pipe(file);
    console.log("Descargando imagen", i);
  });
}
