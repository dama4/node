const { 
    createPool

} = require('mysql');
const pool = createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"attendance",
    connectionLimit: 10
})
pool.query('select * from users where usr_id=?', 
[118549], (err, result, fields)=>{
    if(err){
        return console.log(err);
    }
    return console.log(result);
})