
import { O_json_db} from "./O_json_db.module.js"
// import { O_json_db} from "https://deno.land/x/o_json_db@4.0/O_json_db.module.js"


class O_animal{
    constructor(
        n_id = null,
        s_name){
        this.n_id = n_id; 
        this.s_name = s_name
    }
}
// instance
var o_json_db = new O_json_db();

//create
var a_o = await o_json_db.f_a_o_create(
    O_animal,
    new O_animal(null,'leguan')
);
console.log(a_o)

var a_o = await o_json_db.f_a_o_create(
    O_animal,
    new O_animal(18,'barracuda') //manual n_id
);
console.log(a_o)

var a_o = await o_json_db.f_a_o_create(
    O_animal,
    new O_animal(null,'wale')
);
console.log(a_o)

var a_o = await o_json_db.f_a_o_create(
    O_animal,
    new O_animal(undefined,'kangoroo')
);
console.log(a_o)

var a_o = await o_json_db.f_a_o_create(
    O_animal,
    new O_animal(0,'anaconda') // n_id 0 counts as null or undefined
);
console.log(a_o)

// read
var a_o = (await o_json_db.f_a_o_read(
    O_animal,
    function(o){
        return o.s_name.includes("le")
    }
));
console.log(a_o)

//update
var a_o = (await o_json_db.f_a_o_update(
    O_animal,
    function(o){
        return o.s_name.includes("le")
    },
    function(o){
        o.s_name = `${o.s_name}: after update ${o.s_name.toUpperCase()}`
    }, 
));
console.log(a_o)

// //delete
// var a_o = (await o_json_db.f_a_o_delete(
//     O_animal,
//     function(o){
//         return o.s_name.includes("an")
//     }
// ));

// console.log(a_o)

