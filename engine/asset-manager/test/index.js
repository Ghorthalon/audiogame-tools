const yaml = require('yaml');
const fs = require('fs');

const data = fs.readFileSync('manifest.yaml');
const parsed = yaml.parse(data.toString());
console.log(parsed);