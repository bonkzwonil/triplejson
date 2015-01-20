var _= require('underscore');
// https://www.npmjs.com/package/mpath
var mpath = require('mpath');


var clone = function(obj){
    return JSON.parse(JSON.stringify(obj));
}

var runCommand = function(code, root){
    var command  = _.first(_.keys(code));
    opcodes[command](code[_.keys(code)[0]], root);
}

var opcodes = {
    /*
     "$copy": {"from": "source", "to": "target"}
     "$copy": {"value": "Mondia Media", "to": "target.vendor"}
     */
    $copy: function(options, root){
        if(options.value){
            mpath.set(options.to, options.value, root);
        }else{
            mpath.set(options.to, _.clone(mpath.get(options.from, root)), root);
        }
    },
    /*
     "$delete": "dimension"
     "$delete": "dimension.width"
     */
    $delete: function(options, root){
        delete root[options];
    },
    $move: function(options, root){
        this["$copy"](options, root);
        this["$delete"](options.from, root);
    },
    /*
     "$map": {
         "from": "sourceArray", 
         "to": "targetArray", 
         "do": [
             {"$move": {"from": "FROM", "to": "TO"}},
             {"$delete": "FIELD"}
         ]}}
     */
    $map: function(options, root) {
        var doables = options["do"];
        var result = _.map(mpath.get(options.from, root), function(element){
            _.each(doables, function(doable){
                runCommand(doable, element);
            });
            return element;
        });
        root[options.to] = result;
    },
    /*
      "$copyOne": { "from": "colorCodes", "to": "colors.colorRed", "filter": { "name": "RED" }}
     */
    $copyOne: function(options, root) {
        var element = _.findWhere(mpath.get(options.from, root), options.filter);
        if (element != undefined) {
            this["$copy"]({value: element, to: options.to}, root);
        }
    },
    /*
     "$comment": "My comment"
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
