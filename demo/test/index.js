if (typeof define !== 'function') {
    define = require('amdefine')(module);
}
var testlib = require('../dist/index');

function show(x) {
    let type = eval('typeof ' + x);
    if (type == 'undefined') {
        console.log(x,':','undefined');
    } else {
        console.log(x,':',eval(x));
    }
}
show('testlib');

let mycat = new testlib.Cat();
mycat.talk();
