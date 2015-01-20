var _= require('underscore');
//var async = require('async');


var clone = function(obj){
    return JSON.parse(JSON.stringify(obj));
}

var runCommand = function(code, root){
    var command  = _.first(_.keys(code));
    opcodes[command](code[_.keys(code)[0]], root);
}

var opcodes = {
    $copy: function(options, root){
        if(options.value){
            root[options.to] = options.value;
        }else{
            root[options.to] = _.clone(root[options.from]);
        }
    },
    $delete: function(options, root){
        delete root[options];
    },
    $map: function(options, root) {
        var doables = options["do"];
        var result = _.map(root[options.from], function(element){
            _.each(doables, function(doable){
                runCommand(doable, element);
            });
            return element;
        });
        root[options.to] = result;
    }
};


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

console.log(compiled({source: {wert: "hallo"},
                      mappable: [{von: "hier"},
                                 {von: "hier auch"}]}));


