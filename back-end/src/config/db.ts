import mySql2, { RowDataPacket } from "mysql2";
export const db = mySql2.createPool({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string
}).promise();

