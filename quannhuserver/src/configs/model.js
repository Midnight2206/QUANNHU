import mysql2 from 'mysql2/promise'
const connect = {
    listquantrang: mysql2.createPool({
        host: "localhost",
        user: "root",
        database: "listquantrang",
        charset: "utf8mb4",
    }),
    listdispensations: mysql2.createPool({
        host: "localhost",
        user: "root",
        database: "listdispensations",
        charset: "utf8mb4",
    })
}
export default connect