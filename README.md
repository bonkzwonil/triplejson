# triplejson
Triple JSON is a small mini language in JSON, to transform JSON to JSON

# Usage
    var compiler = require('./compiler');
    var testcode = require('./sample.json');
    var transformer = compile(testcode);

    var rootObject = { //Some Object Tree here
    };
  
    var transformed = transformer(rootObject);

# Language definition
