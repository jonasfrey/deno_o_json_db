import { s_directory_separator } from "./constants.module.js";
import {
    ensureDir,
    ensureFile,
  } from "https://deno.land/std@0.77.0/fs/mod.ts";

var f_s_ymd_hms = function(n_unix_ts_ms){
    var o_date = new Date(n_unix_ts_ms);
    var s_hms_ymd = `${o_date.getFullYear().toString().padStart(2,'0')}-${(o_date.getMonth()+1).toString().padStart(2,'0')}-${o_date.getDate().toString().padStart(2,'0')} ${o_date.getHours().toString().padStart(2,'0')}:${o_date.getMinutes().toString().padStart(2,'0')}:${o_date.getSeconds().toString().padStart(2,'0')}`

    // o_date.getFullYear().toString()+"-"+((o_date.getMonth()+1).toString().length==2?(o_date.getMonth()+1).toString():"0"+(o_date.getMonth()+1).toString())+"-"+(o_date.getDate().toString().length==2?o_date.getDate().toString():"0"+o_date.getDate().toString())+" "+(o_date.getHours().toString().length==2?o_date.getHours().toString():"0"+o_date.getHours().toString())+":"+((parseInt(o_date.getMinutes()/5)*5).toString().length==2?(parseInt(o_date.getMinutes()/5)*5).toString():"0"+(parseInt(o_date.getMinutes()/5)*5).toString())+":00";
    return s_hms_ymd;
}

class O_json_db_callback{
    constructor(
        f_function,
        s_crud_operation_name
    ){
        this.f_function = f_function
        this.s_crud_operation_name = s_crud_operation_name
    }
}

class O_json_db_json_file{
    constructor(o_class){

        this.s_file_name = import.meta.url.split(s_directory_separator).pop()
        this.s_path_name = `.${s_directory_separator}.${this.s_file_name.split(".").shift()}`
        this.s_file_name_suffix = ".json"
        this.s_file_name_prefix = "A_"
        this.s_path_name_models = "."+s_directory_separator
        
       
        this.a_o = []
        this.o_class = o_class

        var a_s_class_names_not_allowed = [
            // "Object", 
            "Array", 
            "Number", 
            "String"
        ];
        if(
            a_s_class_names_not_allowed.includes(this.o_class.name)
            ){
            console.error('the object cannot be instance of one of the following classes ' + a_s_class_names_not_allowed.join(","));

        }

        // this.O_model = o_class.constructor;
        this.s_file_name = this.s_file_name_prefix + this.o_class.name?.toLowerCase() + this.s_file_name_suffix;
        this.s_path_name_file_name = `${this.s_path_name}${s_directory_separator}${this.s_file_name}`

    }

    async f_read_file(
    ){
        
        await ensureDir(this.s_path_name)
        await ensureFile(this.s_path_name_file_name);
        // console.log(s_path_name_file_name)
        
        this.s_json = await Deno.readTextFile(this.s_path_name_file_name);
        if(this.s_json == ''){
            this.s_json = "[]"
        } 
        try {
            this.a_o = JSON.parse(this.s_json);
        } catch (error) {
            // file is not JSON parsable
            // console.log(error)
            // console.log(this.s_json)
            this.a_o = []
        }
        return this.a_o
    }
    async f_write_file(
    ){
        
        await ensureDir(this.s_path_name)
        await ensureFile(this.s_path_name_file_name);
        // console.log(this.a_o)        
        try {
            Deno.writeTextFileSync(this.s_path_name_file_name, JSON.stringify(this.a_o))
        } catch (error) {
            console.log(error)
            return e
        }
        return this.a_o;
    }

}
class O_json_db{
    constructor(){
        this.s_file_name = import.meta.url.split(s_directory_separator).pop()
        this.o_json_db_json_file = new O_json_db_json_file(new Object());// using Object as dummy
        this.o_config =
        this.s_path_o_config = null;
        this.b_init = false;
    }
    async f_o_config(){
        
        var a_s_part = import.meta.url.split("/");
        var s_file_name = a_s_part.pop()
        var a_s_part_filename = s_file_name.split('.')
        a_s_part_filename[0] = a_s_part_filename[0].toLowerCase()+"_config"
        var s_file_name_config = a_s_part_filename.join(".")
        this.s_path_o_config = "./"+s_file_name_config
        a_s_part.push(this.s_path_o_config)
        var s_url = a_s_part.join("/")

        try{
            var o_stat = await Deno.stat(this.s_path_o_config)
        }catch{
            
            // console.log(`${this.s_path_o_config} file does not exists, please download it with this command:`)
            // console.log(`wget ${self.s_url_o_config}`)
            // Deno.exit(1)
            // s_url = "https://deno.land/x/o_json_db@1.2/./o_json_db_config.module.js" //tmp for testing
            var o_response = await fetch(s_url)
            var s_text = await o_response.text();
            console.log(`${s_url} :file did not exists yet, and was downloaded automaitcally`)
            await Deno.writeTextFile(this.s_path_o_config, s_text);
        }
        var {o_json_db_config} = await import(this.s_path_o_config)
        return Promise.resolve(o_json_db_config)
    }
    async f_init(){

        var self = this;
        if(!self.b_init){
            self.o_config = await this.f_o_config();
            


            self.a_o_callback = [
                new O_json_db_callback(
                    function(o_class, o_instance){

                        if(
                            self.o_config.a_s_class_name_default_timestamp_enabled.includes('*')
                            ||
                            self.o_config.a_s_class_name_default_timestamp_enabled.includes(o_class.name)
                            ){
                                if(
                                    self.o_config.a_s_class_name_default_timestamp_disabled.includes(o_class.name) == false
                                ){
                                    var n_ts_ut_ms = new Date().getTime();
                                    o_instance[self.o_config.s_prop_name_timestamp_create_number] = n_ts_ut_ms
                                    o_instance[self.o_config.s_prop_name_timestamp_create_string] = f_s_ymd_hms(n_ts_ut_ms)
                                }
                        }
                    }, 
                    "create", 
                ), 
                // new O_json_db_callback(
                //     function(o_class, o_instance){}, 
                //     "read", 
                // ), 
                new O_json_db_callback(
                    function(o_class, o_instance){

                        if(
                            self.o_config.a_s_class_name_default_timestamp_enabled.includes('*')
                            ||
                            self.o_config.a_s_class_name_default_timestamp_enabled.includes(o_class.name)
                            ){
                                if(
                                    self.o_config.a_s_class_name_default_timestamp_disabled.includes(o_class.name) == false
                                ){
                                    var n_ts_ut_ms = new Date().getTime();
                                    o_instance[self.o_config.s_prop_name_timestamp_update_number] = n_ts_ut_ms
                                    o_instance[self.o_config.s_prop_name_timestamp_update_string] = f_s_ymd_hms(n_ts_ut_ms)
                                }
                        }
                    }, 
                    "update", 
                ),
                // new O_json_db_callback(
                //     function(o_class, o_instance){}, 
                //     "delete", 
                // )
            ]

            this.b_init = true;
        }

    }
    f_o_json_db_json_file(o_class){
        if(o_class.name != this.o_json_db_json_file.o_class.name){
            this.o_json_db_json_file = new O_json_db_json_file(o_class);
        }
        return this.o_json_db_json_file
    }
    async f_a_o_read_file(o_class){
        this.o_json_db_json_file = this.f_o_json_db_json_file(o_class)
        return await this.o_json_db_json_file.f_read_file()
        // return o_json_db_json_file.a_o;
    }
    async f_a_o_write_file(o_class){
        this.o_json_db_json_file = this.f_o_json_db_json_file(o_class)
        // await this.o_json_db_json_file.f_read_file()
        return await this.o_json_db_json_file.f_write_file()
    }

    async f_o_create(
        o_instance,
        s_prop_name_id = 'n_id'
    ){
        await this.f_init();
        var o_class = o_instance.constructor;
        var a = await this.f_a_o_read_file(o_class);
        const b_property_n_id_exists = o_instance.hasOwnProperty(s_prop_name_id);
    
        if(b_property_n_id_exists){
            
            var n_id_max = parseInt(Math.max(0,...a.map(o=>parseInt(o[s_prop_name_id]))))
            // console.log(n_id_max)
            o_instance[s_prop_name_id] = n_id_max+1        
        }
        // console.log(this)
        var a_o_callback_filtered = this.a_o_callback.filter(
            o=>o.s_crud_operation_name == 'create'
        )
        for(var n_index in a_o_callback_filtered){
            const o_callback  = a_o_callback_filtered[n_index];
            // console.log(o_callback)
            o_callback.f_function(
                o_class,
                o_instance
            )
        }

        this.o_json_db_json_file.a_o.push(o_instance);

        this.f_a_o_write_file(o_class);
        return o_instance
    }
    async f_a_o_read(
        o_class, 
        o_filter_criterium = {}
    ){
        await this.f_init();
        
        var a = await this.f_a_o_read_file(o_class);
        var a_o_filtered = a.filter(function(o){
            var b_match = true;
            for(var s_prop in o_filter_criterium){
                b_match = o_filter_criterium[s_prop] == o[s_prop]
            }
            return b_match
        })
        return a_o_filtered       
    }
    async f_a_o_update(
        o_class, 
        o_instance,
        o_instance_updated
    ){
        await this.f_init();

        var a = await this.f_a_o_read_file(o_class);
        var a_o_filtered = a.filter(
            function(o){
                var b_match = true;
                for(var s_prop in o_instance){
                    // console.log(s_prop)
                    b_match = o_instance[s_prop] == o[s_prop]
                }
                return b_match
            }
        )

        var a_o_callback_filtered = this.a_o_callback.filter(
            o=>o.s_crud_operation_name == 'update'
        )

        for(var n_index in a_o_filtered){
            var o = a_o_filtered[n_index];
            for(var s_prop in o_instance_updated){
                o[s_prop] = o_instance_updated[s_prop]
            }

            for(var n_index in a_o_callback_filtered){
                const o_callback  = a_o_callback_filtered[n_index];
                // console.log(o_callback)
                o_callback.f_function(
                    o_class,
                    o
                )
            }
        }

        return await this.f_a_o_write_file(o_class);
    }
    async f_a_o_delete(
        o_class, 
        o_filter_criterium
    ){
        await this.f_init();

        var a = await this.f_a_o_read_file(o_class);
        var a_o_filtered = a.filter(
            function(o, n_index){
                var b_match = true;
                for(var s_prop in o_filter_criterium){
                    b_match = o_filter_criterium[s_prop] == o[s_prop]
                }

                return !b_match
            }
        )
        this.o_json_db_json_file.a_o = a_o_filtered
        this.f_a_o_write_file(o_class);
        return this.o_json_db_json_file.a_o
    }
}

export {O_json_db, O_json_db_callback}