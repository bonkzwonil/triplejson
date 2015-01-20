var _= require('underscore');
//var async = require('async');


var clone = function(obj){
    return JSON.parse(JSON.stringify(obj));
}

var opcodes = {
    $copy: function(options, root){
        root[options.to] = _.clone(root[options.from]);
    },
    $delete: function(options, root){
        delete root[options];
    }
};

var runCommand = function(code, root){
    var command  = _.first(_.keys(code));
    opcodes[command](code[_.keys(code)[0]], root);
}

var compile = function(code){
    return function(root){
        if(_.isArray(code)){
            _.each(code, function(code){
                runCommand(code, root);
            });
        }else{
            runCommand(code, root);
        }
        return root;
    }
};



var testcode = require('./test/sample.json');

var compiled = compile(testcode);

console.log(compiled({source: "hallo"}));



