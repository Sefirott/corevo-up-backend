const express = require("express");
const router = express.Router();
const db = require("@db");
const TABLE_NAME = 'PlcEvents'
const insertEvent = (value) => {
    const {
        FormulaID,
        TagID,
        RealValue,
        Operator,
        Event,
        ScreenGroupID
    } = value;
    return db.query(
        `
            INSERT INTO ${TABLE_NAME} (FormulaID, TagID, RealValue, Operator, Event)
            OUTPUT Inserted.ID
            VALUES (
                 ${FormulaID}, 
                 ${TagID}, 
                '${RealValue}', 
                '${Operator}', 
                '${Event}'
                )
        `
    ).then((result) => {
        const {
            recordset: [{
                ID
            }]
        } = result
        return db.query(`
            INSERT INTO PlcScreensPlcEvents (ScreenGroupID, EventID)
            VALUES (
                 ${ScreenGroupID},
                 ${ID} 
                )
        `)
    });
}

router.get("/groups", async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM ${TABLE_GROUP_NAME}`);
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

router.get("/", async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT * FROM ${TABLE_NAME}`
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

router.get("/byScreen/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await db.query(
            `
                SELECT PE.*
                FROM ${TABLE_NAME} PE
                         INNER JOIN PlcScreensPlcEvents PSPE ON PE.ID = PSPE.EventID
                WHERE PSPE.ScreenGroupID = ${id}
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

router.post("/", async (req, res, next) => {
    try {
        const result = await insertEvent(req.body);
        res.json({
            success: true,
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error,
        });
    }
})

module.exports = router;
