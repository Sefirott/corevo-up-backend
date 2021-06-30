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

router.post("/group", async (req, res, next) => {
    try {
        const {
            Name
        } = req.body

        const result = await db.query(
            `INSERT INTO ${TABLE_PLC_FORMULA_GROUPS} (Name)
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
             FROM ${TABLE_PLC_FORMULA_GROUPS}
             WHERE ID = ${id}
             `
        );

        await db.query(`DELETE FROM ${TABLE_PLC_FORMULAS} WHERE GroupID = ${id}`);

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
});

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
});

router.put("/", async (req, res, next) => {
    try {
        const {
            ID,
            Name,
            Formula,
            Unit,
            GroupID
        } = req.body

        const result = await db.query(
            `
            UPDATE ${TABLE_PLC_FORMULAS} 
            SET Name = '${Name}',
            Formula = '${Formula}',
            "Unit" = '${Unit}',
            GroupID = ${GroupID} 
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
})

router.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            recordset: result
        } = await db.query(
            `
             DELETE
             FROM ${TABLE_PLC_FORMULAS}
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
