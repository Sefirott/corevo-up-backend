const express = require("express");
const router = express.Router();
const db = require("@db");
const {
    TABLE_PLC_PROFILES,
    PLC_TYPE,
    TABLE_PLC_SCREEN_GROUPS,
    TABLE_PLC_FORMULA_GROUPS,
    TABLE_PLC_TAG_GROUPS,
    TABLE_PLC_PARAMS,
    TABLE_PLC_SENSOR_GROUPS,
    TABLE_PLAYER,
    TABLE_PLC_PROFILES_MEETING_ROOM
} = require("@constants");

const insertProfile = (value) => {
    const {
        Name,
        ParameterID,
        ScreenGroupID,
        FormulaGroupID,
        TagGroupID,
        SensorGroupID
    } = value;
    return db.query(
        `
            INSERT INTO ${TABLE_PLC_PROFILES} (Name, ParameterID, ScreenGroupID, FormulaGroupID, TagGroupID, SensorGroupID)
            VALUES (
                '${Name}', 
                ${ParameterID}, 
                ${ScreenGroupID},
                ${FormulaGroupID},
                ${TagGroupID},
                ${SensorGroupID}
            )
        `
    );
}

const updateProfile = (value) => {
    const {
        ID,
        Name,
        ParameterID,
        ScreenGroupID,
        FormulaGroupID,
        TagGroupID,
        SensorGroupID
    } = value;
    return db.query(
        `
            UPDATE ${TABLE_PLC_PROFILES} 
            SET 
                Name = '${Name}', 
                ParameterID = ${ParameterID}, 
                ScreenGroupID = ${ScreenGroupID},
                FormulaGroupID = ${FormulaGroupID}, 
                TagGroupID = ${TagGroupID},
                SensorGroupID = ${SensorGroupID}
            WHERE ID = ${ID}
        `
    );
}


router.get("/", async (req, res, next) => {
    try {
        const result = await db.query(
            `
            SELECT  PP.ID     AS ID,
                    PP.Name   AS Name,
                    PSG.ID    AS ScreenGroupID,
                    PSG.Name  AS ScreenGroup,
                    PFG.ID    AS FormulaGroupID,
                    PFG.Name  AS FormulaGroup,
                    PTG.ID    AS TagGroupID,
                    PTG.Name  AS TagGroup,
                    PPR.ID    AS ParameterID,
                    PPR.Marka AS Parameter,
                    PSNG.ID   AS SensorGroupID,
                    PSNG.Name AS SensorGroup
             FROM ${TABLE_PLC_PROFILES} PP
                      LEFT JOIN ${TABLE_PLC_SCREEN_GROUPS} PSG ON PSG.ID = PP.ScreenGroupID
                      LEFT JOIN ${TABLE_PLC_FORMULA_GROUPS} PFG ON PFG.ID = PP.FormulaGroupID
                      LEFT JOIN ${TABLE_PLC_TAG_GROUPS} PTG ON PTG.ID = PP.TagGroupID
                      LEFT JOIN ${TABLE_PLC_PARAMS} PPR ON PP.ParameterID = PPR.ID
                      LEFT JOIN ${TABLE_PLC_SENSOR_GROUPS} PSNG ON PP.SensorGroupID = PSNG.ID
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


router.get("/byDevice/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const {
            recordset: result
        } = await db.query(
            `
                SELECT
                       P.ID             AS DeviceID,
                       P.PlayerName     as DeviceName,
					   MR.Name as LineName,
                       PP.*
                FROM MeetingRoom MR
                         INNER JOIN ${TABLE_PLAYER} AS P ON CONCAT(',', MR.PlayerID, ',') LIKE CONCAT('%,', P.ID, ',%')
                         INNER JOIN ${TABLE_PLC_PROFILES_MEETING_ROOM} AS PPMR ON MR.ID = PPMR.MeetingRoomID
                         INNER JOIN ${TABLE_PLC_PROFILES} AS PP ON PP.ID = PPMR.ProfileID
                WHERE MR.MeetingRoomTypeID = ${PLC_TYPE}
                  AND P.ID = ${id}
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
        const result = await insertProfile(req.body);
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

router.put("/", async (req, res, next) => {
    try {
        const result = await updateProfile(req.body);
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

module.exports = router;
