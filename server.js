// server.js
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
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

app.post("/obtener", async (req, res) => {
    try {
        const validateBody = req.body;
        await sql.connect(dbConfig);

        if (Object.keys(validateBody).length > 0) {
            const { id } = validateBody;
            const result =
                await sql.query`SELECT * FROM usuarios WHERE id = ${id}`;
            res.json(result.recordset);
        } else {
            const result = await sql.query`SELECT * FROM usuarios`;
            res.json(result.recordset);
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener datos de la base de datos",
        });
    } finally {
        await sql.close();
    }
});

app.post("/insertar", async (req, res) => {
    try {
        console.log(req.body);
        const { nombre, apellido, telefono, correo, sexo, edad } = req.body;

        await sql.connect(dbConfig);

        console.log("Conectado a la base de datos");

        await sql.query`INSERT INTO usuarios (nombre, apellido, telefono, correo, sexo, edad) VALUES (${nombre}, ${apellido}, ${telefono}, ${correo}, ${sexo}, ${edad})`;

        res.status(200).json({
            message: "Dato insertado correctamente",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al insertar datos en la base de datos",
        });
    } finally {
        await sql.close();
    }
});

app.post("/actualizar", async (req, res) => {
    try {
        await sql.connect(dbConfig);

        console.log("first");

        const { id, nombre, apellido, telefono, correo, sexo, edad } = req.body;

        let query = `UPDATE usuarios SET`;

        if (nombre) {
            query += ` nombre = '${nombre}',`;
        }

        if (apellido) {
            query += ` apellido = '${apellido}',`;
        }

        if (telefono) {
            query += ` telefono = '${telefono}',`;
        }

        if (correo) {
            query += ` correo = '${correo}',`;
        }

        if (sexo) {
            query += ` sexo = '${sexo}',`;
        }

        if (edad) {
            query += ` edad = ${edad},`;
        }

        query = query.slice(0, -1);

        query += ` WHERE id = ${id}`;

        console.log(query);

        await sql.query(query);

        res.status(200).json({
            message: "Dato actualizado correctamente",
        });
    } catch (error) {
        res.status(500).json({
            message: "Hubo un error al actualizar el dato",
        });
    } finally {
        await sql.close();
    }
});

app.delete("/borrar", async (req, res) => {
    try {
        const { id } = req.body;

        await sql.connect(dbConfig);

        await sql.query`DELETE FROM usuarios WHERE id = ${id}`;

        res.status(200).json({
            message: "Dato eliminado correctamente",
        });
    } catch (error) {
        res.status(500).json({
            message: "Hubo un error al eliminar el dato",
        });
    } finally {
        await sql.close();
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor intermedio escuchando en el puerto ${PORT}`);
});
