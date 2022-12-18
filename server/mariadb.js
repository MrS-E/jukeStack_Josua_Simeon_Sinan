const mariadb = require("mariadb");
class mariadb_handler{
    constructor(data) {
        this.db = mariadb.createPool({
            user: data.user,
            host: data.host,
            password: data.password,
            database: data.database,
            connectionLimit: 5
        })
    }

    async query(query, attr){
        if(attr!==undefined && attr!==null) {
            const regex = /\?/i;
            for (let x = 0; x < attr.length; x++) {
                query = query.replace(regex, attr[x]);
            }
        }
        //let out;
        //let err;
        try {
            let conn = await this.db.getConnection();
            let out = await conn.query(query);

            console.log("out",out)
            return {typ:"result", data:out};
        }catch (e) {
            //err = e;
            console.log("eeror",e)
            return {typ:"error", data:e};
        }
        //return err, out;
    }
}

module.exports.mariadb = mariadb_handler;
