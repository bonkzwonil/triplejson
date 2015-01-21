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
The Language is written in JSON.
Each Programm is a set of Commands, written as a JSON Array:

So:

    [{"$copy": {"value": "hello", "to": "world"}}]
    
is the simpliest Hello World, which just puts the constant string "hello" into rootObject.world.

This Example copies the "here" property of the object in the "sub" property of the root object (an array) to the "there" property, mapping it on the fly, so that all "junk" properties get deleted:

    [{"$map": {"from": "sub.here", "to": "there", "do":[
        {"$delete": "junk"}]}]


So that: 
    {sub: {here: [{id: 1, junk: "crap"},{id:2, junk: "garbage"}]}}

becomes:
    {sub: {here: [{id: 1, junk: "crap"},{id:2, junk: "garbage"}]}
     there: [{id:1},{id:2}]}
     



