const express = require("express");
const router = express.Router();
const db = require("@db");
const {TABLE_DEVICES, PLC_TYPE, COMPANY_ID} = require("@constants");

const insertDevice = (value) => {
    const {
        Name,
    } = value;
    return db.query(
        `
            INSERT INTO ${TABLE_DEVICES} (PlayerName, Type, PlayerIP,  CUser, CDate, Status, CompanyId)
            VALUES ( '${Name}', ${PLC_TYPE}, '0.0.0.0', 1, CURRENT_TIMESTAMP, 1, ${COMPANY_ID})
        `
    );
}

router.get("/", async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM Player WHERE Status = 1 AND Type = ${PLC_TYPE} AND CompanyId = ${COMPANY_ID}`);
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
        const result = await insertDevice(req.body);
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

module.exports = router;
