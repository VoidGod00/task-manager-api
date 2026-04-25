require('dotenv').config();
const app = require('./src/app');
const { connectMongo }    = require('./src/config/mongo');
const { connectPostgres } = require('./src/config/postgres');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectPostgres();
        await connectMongo();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`); 
        });
    } catch (err) {
        console.error('Startup failed:', err.message);
        process.exit(1);
    }
}

startServer();