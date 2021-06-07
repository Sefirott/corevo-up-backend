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
        IsFormula,
        ScreenType,
    } = value;
    return db.query(
        `
            INSERT INTO ${TABLE_PLC_SCREENS} (AreaID, Name1, Formula1ID, Name2, 
            Formula2ID, GroupID, SensorTypeID, SensorGroupID, IsFormula, ScreenType)
            VALUES (
                '${AreaID}', 
                '${Name1}', 
                '${+Formula1ID}', 
                '${Name2}', 
                '${+Formula2ID}', 
                '${GroupID}',
                '${+SensorTypeID}', 
                '${+SensorGroupID}',
                '${+IsFormula}',
                '${ScreenType}'
            )
        `
    );
}

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
})

// router.put("/", async (req, res, next) => {
//     try {
//         const {
//             ID,
//             Name,
//             Address,
//             Type,
//             ScanTime,
//             Desc,
//             Unit,
//             InstantTracking,
//             GroupID
//         } = req.body
//
//         const result = await db.query(
//             `
//             UPDATE PlcTags
//             SET Name = '${Name}',
//             Address = '${Address}',
//             Type = '${Type}',
//             ScanTime = ${ScanTime},
//             "Desc" = '${Desc}',
//             Unit = '${Unit}',
//             InstantTracking = '${InstantTracking}',
//             GroupID = ${GroupID}
//             WHERE
//             ID = ${ID}
//             `
//         );
//         res.json({
//             success: true,
//             result,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error,
//         });
//     }
// })

module.exports = router;
