var expect = require('expect');


var testcode = require('./sample.json');
var compile = require('../compiler');

var compiled = compile(testcode);


var result = compiled({source: {wert: "hallo"},
                       mappable: [{von: "hier"},
                                  {von: "hier auch"}]});
describe('basic tests', function(){
    it('should run all expects', function(done){
        expect(result).toExist();
        
        expect(result.source).toNotExist();
        
        expect(result.target).toExist().toEqual({wert: "hallo"});
        done();
    });
});


