let out = "";
for(let i = 2; i < process.argv.length; i++) {
  out += "\\x02" + process.argv[i] + "\\x00";
}
console.log("\"" + out + "\"");
