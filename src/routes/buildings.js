const express = require("express");
const router = express.Router();
const db = require("@db");
const {TABLE_MEETING_BUILDING, PLC_TYPE} = require("@constants");


const insertBuilding = (value) => {
    const {
        Name,
        CampusID
    } = value
    return db.query(`
        INSERT INTO ${TABLE_MEETING_BUILDING} (Name, Code, CampusID, CUser, CDate, Status)
        VALUES ('${Name}', ${PLC_TYPE}, ${CampusID}, 1, CURRENT_TIMESTAMP, 1);
    `)
}

router.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await db.query(`SELECT * FROM ${TABLE_MEETING_BUILDING} WHERE Status = 1 AND CampusID = ${id}`);
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
        const result = await insertBuilding(req.body);
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
