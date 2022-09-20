
import {O_json_db} from "http://deno.land/x/o_json_db@1.3/O_json_db.module.js"

var o_json_db = new O_json_db()


class O_great_test{
    constructor(
        n, 
        s, 
        o, 
        a
    ){
        this.s = s
        this.n = n
        this.o = o
        this.a = a
    }
}


var o_great_test = new O_great_test(
    1234,
    "asdf", 
    {
        n:1234, 
        s:'asdf'
    }, 
    [
        1234,
        "asdf", 
        {
            n:1234, 
            s:'asdf'
        }, 
    ]
)

await o_json_db.f_o_create(o_great_test); 
