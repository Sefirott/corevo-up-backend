const express = require("express");
const router = express.Router();
const db = require("@db");
const {
    TABLE_PLC_SCREENS,
    TABLE_PLC_SCREEN_GROUPS,
    TABLE_PLC_FORMULAS,
    TABLE_PLC_FORMULA_GROUPS,
    TABLE_PLC_SENSORS,
    TABLE_PLC_SENSOR_GROUPS,
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
            `
                SELECT PS.*,
                CASE PS.AreaID
                    WHEN 1 THEN 'ALAN-1'
                    WHEN 2 THEN 'ALAN-2'
                    WHEN 3 THEN 'ALAN-3'
                    WHEN 4 THEN 'ALAN-4'
                    WHEN 5 THEN 'ALAN-5'
                    WHEN 6 THEN 'ALAN-6'
                    WHEN 7 THEN 'ALAN-7'
                    WHEN 8 THEN 'ALAN-8'
                    WHEN 9 THEN 'ALAN-9'
                    WHEN 10 THEN 'ALAN-10'
                    WHEN 11 THEN 'ALAN-11'
                    WHEN 12 THEN 'ALAN-12'
                    WHEN 13 THEN 'ALAN-13'
                    WHEN 14 THEN 'ALAN-14'
                    WHEN 15 THEN 'ALAN-15'
                    ELSE 'N/A'
                END AS AreaName,
                PSG.Name AS ScreenGroupName,
                CASE PS.ScreenType
                    WHEN 1 THEN 'Ekran 1'
                    WHEN 2 THEN 'Ekran 2'
                    ELSE 'N/A'
                END AS ScreenTypeName,
                (SELECT Name FROM ${TABLE_PLC_SENSOR_GROUPS} PSEG WHERE PSEG.ID = PS.SensorGroupID) AS SensorGroupName,
                CASE PS.SensorTypeID
                    WHEN 1 THEN 'Uyarı'
                    WHEN 2 THEN 'Fire'
                    WHEN 3 THEN 'Stop'
                    ELSE 'N/A'
                END AS SensorTypeName,
                (SELECT Name FROM ${TABLE_PLC_FORMULA_GROUPS} PFG WHERE PFG.ID = PS.FormulaGroupID) AS FormulaGroupName,
                (SELECT Name FROM ${TABLE_PLC_FORMULAS} PF WHERE PF.ID = PS.Formula1ID AND PF.GroupID = PS.FormulaGroupID) AS Formula1Name,
                (SELECT Name FROM ${TABLE_PLC_FORMULAS} PF WHERE PF.ID = PS.Formula2ID AND PF.GroupID = PS.FormulaGroupID) AS Formula2Name
                FROM ${TABLE_PLC_SCREENS} PS
                         INNER JOIN ${TABLE_PLC_SCREEN_GROUPS} PSG ON PSG.ID = PS.GroupID
                WHERE PS.GroupID = ${id}
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
