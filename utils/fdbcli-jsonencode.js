const fs = require("fs");

const s = new TextEncoder().encode(JSON.stringify(JSON.parse(fs.readFileSync(process.argv[2], "utf-8"))))
let out = "";
for(const b of s) {
  out += "\\x" + ('0' + (b & 0xff).toString(16)).slice(-2);
}
console.log("\"" + out + "\"");
