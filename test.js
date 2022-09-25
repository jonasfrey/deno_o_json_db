
import { O_json_db} from "./O_json_db.module.js"


class O_test{
    constructor(s_name){
        this.n_id = 0; 
        this.s_name = s_name
    }
}

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



console.log("test behaviour if a file would get corrupted somehow")

class O_test_json_corruption{
    constructor(s_name){
        this.s_name = s_name
    }
}

var o = await o_json_db.f_o_create(new O_test_json_corruption('one')); 
var o = await o_json_db.f_o_create(new O_test_json_corruption('two')); 
var o = await o_json_db.f_o_create(new O_test_json_corruption('three'));

var s_corrupt_or_nonvalid_json = `
{
    's_name': 'one'//comment is not allowed in valid json
},
{
    s_name: 'two'// property names need to be quoted 
},
{
    s_name: 'three', // a trailing comma is not allowed
}
`
var s_path = "./.O_json_db/A_o_test_json_corruption.json";
try{
    await Deno.remove(s_path)
}catch(e){
    console.log(e)
}
var s = await Deno.writeTextFile(s_path, s_corrupt_or_nonvalid_json);
var s = await Deno.readTextFile(s_path);
console.log(s_path)
console.log(s)
var o = await o_json_db.f_o_create(new O_test_json_corruption('four'));
console.log("done")

// var n_i =0; 
// while(n_i < 5){
//     await o_json_db.f_o_create(
//         new O_test('name '+ n_i)
//     ); 
//     n_i+=1;
// }
// console.log(o_json_db)



