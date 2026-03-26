import sql from 'mssql';

// 1. Database එකට සම්බන්ධ වීමට අවශ්‍ය Configuration දත්ත
export const config = {
    user: 'unisphere_user', 
    password: 'User@123', 
    server: 'localhost', 
    port: 1433,
    database: 'UniSphereDB',
    options: {
        encrypt: true, // SQL Azure වැනි cloud database සඳහා අවශ්‍යයි
        trustServerCertificate: true, // Local development වලදී self-signed certificates සඳහා
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// 2. ES Modules වලදී 'import config from...' ලෙස භාවිතා කිරීමට මෙය අනිවාර්යයි
export default config; 

// 3. පහත කොටස Connection එක test කර බැලීමට භාවිතා කළ හැක
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