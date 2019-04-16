"use strict";

var _express = _repo(require("express"));

var _bodyParser = _repo(require("body-parser"));

var _dotenv = _repo(require("dotenv"));

var _Routes = _repo(require("./routes/Routes"));

function _repo(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

var app = (0, _express.default)();
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use(_bodyParser.default.json());
app.use('/api', _Routes.default);
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  return console.log("The server is listening on port ".concat(port));
});
module.exports = server; 