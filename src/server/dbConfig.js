import sql from 'mssql';


export const config = {
    user: 'unisphere_user', 
    password: 'User@123', 
    server: 'localhost', 
    port: 1433,
    database: 'UniSphereDB',
    options: {
        encrypt: true, 
        trustServerCertificate: true, 
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};


export default config; 


export const connectDB = async () => {
    try {
        let pool = await sql.connect(config);
        console.log("✅ SQL Server Connected Successfully!");
        return pool;
    } catch (err) {
        console.error("❌ Database Connection Failed: ", err.message);
        throw err;
    }
};