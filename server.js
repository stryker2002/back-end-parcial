// server.js
const express = require("express");
const app = express();
const cors = require('cors');
const sql = require("mssql");

// Habilitar CORS para todas las solicitudes
app.use(cors());

const dbConfig = {
    user: "administrador",
    password: "administrador",
    server: "localhost",
    port: 1433,
    database: "exposicion",
    options: {
        encrypt: false, // Si tu servidor SQL Server no requiere SSL, establece esto en false
    },
};

app.get("/datos", async (req, res) => {
    try {
        await sql.connect(dbConfig);
        console.log("Conectado a la base de datos");
        const result = await sql.query`SELECT * FROM usuarios`;
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener datos de la base de datos",
        });
    } finally {
        await sql.close();
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor intermedio escuchando en el puerto ${PORT}`);
});
