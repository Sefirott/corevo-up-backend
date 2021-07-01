const express = require("express");
const router = express.Router();
const db = require("@db");

const {
    TABLE_PLC_EVENTS,
    TABLE_PLC_SCREENS_PLC_EVENTS,
} = require("@constants");

const insertEvent = (value) => {
    const {
        IsFormula,
        FormulaGroupID,
        TagGroupID,
        FormulaID,
        TagID,
        RealValue,
        Operator,
        Event,
        ScreenGroupID
    } = value;
    return db.query(
        `
            INSERT INTO ${TABLE_PLC_EVENTS} (FormulaID, TagID, RealValue, Operator, Event, IsFormula, FormulaGroupID, TagGroupID)
            OUTPUT Inserted.ID
            VALUES (
                 ${FormulaID}, 
                 ${TagID}, 
                '${RealValue}', 
                '${Operator}', 
                '${Event}',
                '${+IsFormula}'
                '${+FormulaGroupID}'
                '${+TagGroupID}'
                )
        `
    ).then((result) => {
        const {
            recordset: [{
                ID
            }]
        } = result
        return db.query(`
            INSERT INTO ${TABLE_PLC_SCREENS_PLC_EVENTS} (ScreenGroupID, EventID)
            VALUES (
                 ${ScreenGroupID},
                 ${ID} 
                )
        `)
    });
}

router.get("/", async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT * FROM ${TABLE_PLC_EVENTS}`
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
                FROM ${TABLE_PLC_EVENTS} PE
                         INNER JOIN ${TABLE_PLC_SCREENS_PLC_EVENTS} PSPE ON PE.ID = PSPE.EventID
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
});

router.put("/", async (req, res, next) => {
    try {
        const {
            ID,
            IsFormula,
            FormulaGroupID,
            TagGroupID,
            FormulaID,
            TagID,
            RealValue,
            Operator,
            Event,
            ScreenGroupID
        } = req.body;

        const result = await db.query(
            `
            UPDATE ${TABLE_PLC_EVENTS} 
            SET FormulaID = ${FormulaID},
            IsFormula = '${+IsFormula}',
            FormulaGroupID = '${+FormulaGroupID}',
            TagGroupID = '${+TagGroupID}',
            TagID = ${TagID},
            RealValue = '${RealValue}',
            Operator = '${Operator}',
            Event = '${Event}'
            WHERE
            ID = ${ID}
            `
        );

        await db.query(`DELETE ${TABLE_PLC_SCREENS_PLC_EVENTS} WHERE EventID = ${ID}`);

        await db.query(
            `INSERT ${TABLE_PLC_SCREENS_PLC_EVENTS} ( ScreenGroupID, EventID ) VALUES ( '${ScreenGroupID}', '${ID}' )`
        );

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
});

router.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            recordset: result
        } = await db.query(
            `
             DELETE
             FROM ${TABLE_PLC_EVENTS}
             WHERE ID = ${id}
             `
        );

        await db.query(`DELETE FROM ${TABLE_PLC_SCREENS_PLC_EVENTS} WHERE EventID = ${id}`);

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
