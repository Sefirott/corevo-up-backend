const express = require("express");
const router = express.Router();
const db = require("@db");
const {
    TABLE_PLC_FORMULAS,
    TABLE_PLC_FORMULA_GROUPS
} = require("@constants");
const insertFormula = (value) => {
    const {
        Name,
        Formula,
        Unit,
        GroupID
    } = value;
    return db.query(
        `
            INSERT INTO ${TABLE_PLC_FORMULAS} (Name, Formula, Unit, GroupID)
            VALUES ('${Name}', '${Formula}', '${Unit}', '${GroupID}')
        `
    );
}

router.get("/groups", async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM ${TABLE_PLC_FORMULA_GROUPS}`);
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

router.post("/byGroups", async (req, res, next) => {
    try {

        const inArray = req.body
        const result = await db.query(
            `SELECT * FROM ${TABLE_PLC_FORMULAS} WHERE GroupID IN (${inArray.length > 0 ? inArray.join(',') : 0})`
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
})

router.get("/groups/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            recordset: result
        } = await db.query(
            `SELECT * FROM ${TABLE_PLC_FORMULAS} WHERE GroupID = ${id}`
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
        const result = await insertFormula(req.body);
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
