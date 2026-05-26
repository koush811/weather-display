const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./heat.db")

db.serialize(()=>{

    db.run(`

        CREATE TABLE IF NOT EXISTS alerts(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            message TEXT,

            level TEXT

        )

    `)

})

module.exports = db