import { O_test } from "./O_test.module.js"
import { O_json_db} from "./O_json_db.module.js"


// class Person {}
// var a = new Person()
// console.log(a.constructor)
// var b = new a.constructor()
// console.log(b)
// var o = {}
// o.constructor()
// console.log(o.constructor.name); 
// var a = []
// a.constructor()
// console.log(a.constructor.name); 
// Deno.exit(0);


var o_json_db = new O_json_db();


//create some objects
var o = await o_json_db.f_o_create(new O_test('leguan')); 
console.log(o)
var o = await o_json_db.f_o_create(new O_test('tiger')); 
console.log(o)
var o = await o_json_db.f_o_create(new O_test('dog')); 
console.log(o)
var o = await o_json_db.f_o_create(new O_test('cat'));

var o = await o_json_db.f_o_create(new O_test('leguan')); 
var a_o = await o_json_db.f_a_o_read(
    O_test,
    {
        n_id: 10
    }
);

console.log("read all") 
var a_o = await o_json_db.f_a_o_read(
    O_test,
    {}
);
console.log(a_o)
console.log("read with criterium (n_id : 5)")
var a_o = await o_json_db.f_a_o_read(
    O_test,
    {n_id: 5}
);
console.log(a_o)
console.log("read with criterium (s_name: 'tiger')")
var a_o = await o_json_db.f_a_o_read(
    O_test,
    {s_name: "tiger"}
);
console.log(a_o)




console.log("read all") 
var a_o = await o_json_db.f_a_o_read(
    O_test,
    {}
);
console.log(a_o)


console.log("update with criterium {s_name: 'leguan'}, updated {s_name: 'iguana'}") 
var a_o = await o_json_db.f_a_o_update(
    O_test,
    {s_name:"leguan"},
    {s_name:"iguana"}
);
console.log(a_o)



var a_o = await o_json_db.f_a_o_update(
    O_test,
    {s_name:"tiger"},
    {s_name:"tiger-cat"}
);
console.log(a_o)


// var n_i =0; 
// while(n_i < 5){
//     await o_json_db.f_o_create(
//         new O_test('name '+ n_i)
//     ); 
//     n_i+=1;
// }
// console.log(o_json_db)
