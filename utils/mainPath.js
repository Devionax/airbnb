const path = require("path");

const mainDomainPath = path.dirname(require.main.filename);

exports.mainDomain = { mainDomainPath };
