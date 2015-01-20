/*
Copyright (c) 2015 MondiaMedia Group.
All rights reserved.

Redistribution and use in source and binary forms are permitted
provided that the above copyright notice and this paragraph are
duplicated in all such forms and that any documentation,
advertising materials, and other materials related to such
distribution and use acknowledge that the software was developed
by the <organization>. The name of the
<organization> may not be used to endorse or promote products derived
from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED ``AS IS'' AND WITHOUT ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
*/

var _= require('underscore');

// https://www.npmjs.com/package/mpath
// Despite it's more powerful query language, mpath doesn't support
// setters where a path-part is missing in the target,
// e.g. set('target.NotExist.color', 'Red')
// See also mocha tests 
//var mpath = require('mpath');

// https://www.npmjs.com/package/dotty
var dotty = require('dotty');

var runCommand = function(code, root){
    var command  = _.first(_.keys(code));
    opcodes[command](code[command], root);
};

var opcodes = {
    /*
     "$copy": {"from": "PATH", "to": "PATH"}
     "$copy": {"value": "CONSTANT", "to": "PATH"}
     */
    $copy: function(options, root){
        if(options.value){
            dotty.put(root, options.to, options.value);
        }else{
            dotty.put(root, options.to, _.clone(dotty.get(root, options.from)));
        }
    },
    /*
     "$delete": "PATH"
     */
    $delete: function(options, root){
        delete root[options];
    },
    /*
     "$move": {"from": "PATH", "to": "PATH"}
     */
    $move: function(options, root){
        this["$copy"](options, root);
        this["$delete"](options.from, root);
    },
    /*
     "$map": {
         "from": "PATH", // Points to an array 
         "to": "PATH", 
         "do": [
             {"$move": {"from": "PATH", "to": "PATH"}},
             {"$delete": "PATH"} // Path relative to current object
         ]}}
     */
    $map: function(options, root) {
        var doables = options["do"];
        var result = _.map( dotty.get(root, options.from), function(element){
            _.each(doables, function(doable){
                runCommand(doable, element);
            });
            return element;
        });
        root[options.to] = result;
    },
    /*
      "$copyOne": { "from": "PATH", "to": "PATH", "filter": { "field": "value" }}
     */
    $copyOne: function(options, root) {
        var element = _.findWhere( dotty.get(root, options.from), options.filter);
        if (element != undefined) {
            this["$copy"]({value: element, to: options.to}, root);
        }
    },
    /*
     "$comment": "My comment"
     "$comment": { .... }
     */
    $comment: function(options, root) {
        // Do nothing
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
        //console.log(root);
        return root;
    }
};


module.exports = compile;
