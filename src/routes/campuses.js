const express = require("express");
const router = express.Router();
const db = require("@db");
const {TABLE_MEETING_CAMPUS, PLC_TYPE} = require("@constants");

const insertCampus = (value) => {
    const {Name} = value
    return db.query(`
        INSERT INTO ${TABLE_MEETING_CAMPUS} (Name, Code, CUser, CDate, Status)
        VALUES ('${Name}', ${PLC_TYPE}, 1, CURRENT_TIMESTAMP, 1);
    `)
}

router.get("/", async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM ${TABLE_MEETING_CAMPUS} where Status = 1`);
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

router.post("/", async (req, res, next) => {
    try {
        const result = await insertCampus(req.body);
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
