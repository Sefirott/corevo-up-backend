const express = require("express");
const router = express.Router();
const db = require("@db");
const {TABLE_MEETING_FLOOR, PLC_TYPE} = require("@constants");

const insertFloor = (value) => {
    const {
        Name,
        BuildingID
    } = value
    return db.query(`
        INSERT INTO ${TABLE_MEETING_FLOOR} (Name, Code, BuildingID, CUser, CDate, Status)
        VALUES ('${Name}', ${PLC_TYPE}, ${BuildingID}, 1, CURRENT_TIMESTAMP, 1);
    `)
}

router.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await db.query(`SELECT * FROM ${TABLE_MEETING_FLOOR} WHERE Status = 1 AND BuildingID = ${id}`);
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
        const result = await insertFloor(req.body);
        res.json({
            success: true,
            result,
        });
    } catch (error) {
        res.json({
            success: false,
            error
        })
    }
});

module.exports = router;
