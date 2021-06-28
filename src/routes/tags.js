const express = require("express");
const router = express.Router();
const db = require("@db");

const {
    TABLE_PLC_TAGS,
    TABLE_PLC_TAG_GROUPS
} = require("@constants");

router.get("/groups", async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM ${TABLE_PLC_TAG_GROUPS}`);
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
            `SELECT * FROM ${TABLE_PLC_TAGS} WHERE GroupID IN (${inArray.length > 0 ? inArray.join(',') : 0})`
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
            `SELECT *
             FROM ${TABLE_PLC_TAGS} WHERE GroupID = ${id}`
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
            Name,
            Address,
            Type,
            ScanTime,
            Desc,
            Unit,
            InstantTracking,
            GroupID
        } = req.body

        const result = await db.query(
            `INSERT INTO ${TABLE_PLC_TAGS} (Name, Address, Type, ScanTime, "Desc", Unit, InstantTracking, GroupID)
             VALUES ('${Name}', '${Address}', '${Type}', ${ScanTime}, '${Desc}', '${Unit}', '${InstantTracking}', ${GroupID})`
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

router.post("/group", async (req, res, next) => {
    try {
        const {
            Name
        } = req.body

        const result = await db.query(
            `INSERT INTO ${TABLE_PLC_TAG_GROUPS} (Name)
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
})

router.delete("/group/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            recordset: result
        } = await db.query(
            `
             DELETE
             FROM ${TABLE_PLC_TAG_GROUPS}
             WHERE ID = ${id}
             `
        );

        /*ALTER TABLE [dbo].[PlcTags] ADD FOREIGN KEY ([GroupID]) REFERENCES [dbo].[PlcTagGroups] ([ID]) ON DELETE SET NULL ON UPDATE CASCADE
        GO*/
        await db.query(`DELETE FROM ${TABLE_PLC_TAGS} WHERE GroupID = ${id}`);

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

router.put("/", async (req, res, next) => {
    try {
        const {
            ID,
            Name,
            Address,
            Type,
            ScanTime,
            Desc,
            Unit,
            InstantTracking,
            GroupID
        } = req.body

        const result = await db.query(
            `
            UPDATE ${TABLE_PLC_TAGS} 
            SET Name = '${Name}',
            Address = '${Address}',
            Type = '${Type}',
            ScanTime = ${ScanTime},
            "Desc" = '${Desc}',
            Unit = '${Unit}',
            InstantTracking = '${InstantTracking}',
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

module.exports = router;
