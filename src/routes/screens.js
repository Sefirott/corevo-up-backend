const express = require("express");
const router = express.Router();
const db = require("@db");
const {
    TABLE_PLC_SCREENS,
    TABLE_PLC_SCREEN_GROUPS
} = require("@constants");

const insertScreen = (value) => {
    const {
        AreaID,
        Name1,
        Formula1ID,
        Name2,
        Formula2ID,
        GroupID,
        SensorTypeID,
        SensorGroupID,
        FormulaGroupID,
        IsFormula,
        ScreenType,
    } = value;
    return db.query(
        `
            INSERT INTO ${TABLE_PLC_SCREENS} (AreaID, Name1, Formula1ID, Name2, 
            Formula2ID, GroupID, SensorTypeID, SensorGroupID, FormulaGroupID, IsFormula, ScreenType)
            VALUES (
                '${AreaID}', 
                '${Name1}', 
                '${+Formula1ID}', 
                '${Name2}', 
                '${+Formula2ID}', 
                '${GroupID}',
                '${+SensorTypeID}', 
                '${+SensorGroupID}',
                '${+FormulaGroupID}',
                '${+IsFormula}',
                '${ScreenType}'
            )
        `
    );
}

router.post("/group", async (req, res, next) => {
    try {
        const {
            Name
        } = req.body

        const result = await db.query(
            `INSERT INTO ${TABLE_PLC_SCREEN_GROUPS} (Name)
             VALUES ('${Name}')`
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

router.delete("/group/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            recordset: result
        } = await db.query(
            `
             DELETE
             FROM ${TABLE_PLC_SCREEN_GROUPS}
             WHERE ID = ${id}
             `
        );

        await db.query(`DELETE FROM ${TABLE_PLC_SCREENS} WHERE GroupID = ${id}`);

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

router.get("/groups", async (req, res, next) => {
    try {
        const {
            recordset: result
        } = await db.query(`SELECT * FROM ${TABLE_PLC_SCREEN_GROUPS}`);
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

router.get("/groups/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            recordset: result
        } = await db.query(
            `SELECT * FROM ${TABLE_PLC_SCREENS} WHERE GroupID = ${id}`
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
        const {
            recordset: result
        } = await insertScreen(req.body);
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
            AreaID,
            Name1,
            Formula1ID,
            Name2,
            Formula2ID,
            GroupID,
            SensorTypeID,
            SensorGroupID,
            FormulaGroupID,
            IsFormula,
            ScreenType,
        } = req.body

        const result = await db.query(
            `
            UPDATE ${TABLE_PLC_SCREENS} 
            SET AreaID = '${AreaID}',
            Name1 = '${Name1}',
            Formula1ID = '${+Formula1ID}',
            Name2 = '${Name2}',
            Formula2ID = '${+Formula2ID}',
            GroupID = '${GroupID}',
            SensorTypeID = '${+SensorTypeID}',
            SensorGroupID = '${+SensorGroupID}',
            FormulaGroupID = '${+FormulaGroupID}',
            IsFormula = '${+IsFormula}',
            ScreenType = '${ScreenType}' 
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
             FROM ${TABLE_PLC_SCREENS}
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
