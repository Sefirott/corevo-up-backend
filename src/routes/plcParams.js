const express = require("express");
const router = express.Router();
const db = require("@db");
const {TABLE_PLC_PARAMS} = require("@constants");

router.get("/", async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT * FROM ${TABLE_PLC_PARAMS}`
        );
        res.json({
            success: true,
            result,
        });
    } catch (error) {
        res.json({
            success: false,
            error,
        });
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            recordset: result
        } = await db.query(
            `
             SELECT *
             FROM ${TABLE_PLC_PARAMS}
             WHERE ID = ${id}
             `
        );
        res.json({
            success: true,
            result,
        });
    } catch (error) {
        res.json({
            success: false,
            error,
        });
    }
});

router.post("/", async (req, res, next) => {
    try {
        const {
            Marka,
            Model,
            IpAddress,
            PortType,
            PortNum
        } = req.body

        const result = await db.query(
            `INSERT INTO ${TABLE_PLC_PARAMS} (Marka, Model, IpAddress, PortType, PortNum)
             VALUES ('${Marka}', '${Model}', '${IpAddress}', '${PortType}', '${PortNum}')`
        );
        res.json({
            success: true,
            result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
});

router.put("/", async (req, res, next) => {
    try {
        const {
            ID,
            Marka,
            Model,
            IpAddress,
            PortType,
            PortNum
        } = req.body

        const result = await db.query(
            `
            UPDATE ${TABLE_PLC_PARAMS} 
            SET Marka = '${Marka}',
            Model = '${Model}',
            IpAddress = '${IpAddress}',
            PortType = '${PortType}',
            PortNum = '${PortNum}' 
            WHERE
            ID = ${ID}
            `
        );
        res.json({
            success: true,
            result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            recordset: result
        } = await db.query(
            `
             DELETE
             FROM ${TABLE_PLC_PARAMS}
             WHERE ID = ${id}
             `
        );
        res.json({
            success: true,
            result,
        });
    } catch (error) {
        res.json({
            success: false,
            error,
        });
    }
});

module.exports = router;
