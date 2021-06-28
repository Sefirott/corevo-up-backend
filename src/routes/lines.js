const express = require("express");
const router = express.Router();
const db = require("@db");
const {
    TABLE_MEETING_CAMPUS,
    PLC_TYPE,
    TABLE_MEETING_BUILDING,
    TABLE_MEETING_ROOM,
    TABLE_MEETING_FLOOR,
    TABLE_PLAYER,
    TABLE_PLC_PROFILES,
    TABLE_PLC_PROFILES_MEETING_ROOM
} = require("@constants");

const insertLine = (value) => {
    const {
        Name,
        Floor,
        ProfileID,
        Device
    } = value
    return db.query(`
        INSERT INTO ${TABLE_MEETING_ROOM} (Name, PlayerID, MeetingRoomTypeID, FloorID, CUser, CDate, Status)
        OUTPUT Inserted.ID
        VALUES ('${Name}', '${Device.join(',')}', ${PLC_TYPE}, ${Floor}, 1, CURRENT_TIMESTAMP, 1);
    `).then((result) => {
        const {
            recordset: [{
                ID
            }]
        } = result

        return db.query(`
            INSERT INTO ${TABLE_PLC_PROFILES_MEETING_ROOM} (MeetingRoomID, ProfileID)
            VALUES (
                 ${ID},
                 ${ProfileID} 
                )
        `)
    })
}

router.get("/", async (req, res, next) => {
    try {
        const {
            recordset: result
        } = await db.query(
            `
                SELECT MR.ID,
                       MR.Name                        AS LineName,
                       MF.ID                          AS FloorID,
                       MF.Name                        AS FloorName,
                       MB.ID                          AS BuildingID,
                       MB.Name                        AS BuildingName,
                       MC.ID                          AS CampusID,
                       MC.Name                        AS CampusName,
                       PP.ID                          AS ProfileID,
                       PP.Name                        AS ProfileName,
                       STRING_AGG(P.ID, ', ')         AS PlayerID,
                       STRING_AGG(P.PlayerName, ', ') AS PlayerName,
                       0                              AS ConnectionStatus
                FROM ${TABLE_MEETING_ROOM} AS MR
                         INNER JOIN ${TABLE_MEETING_FLOOR} AS MF ON MF.ID = MR.FloorID
                    AND MF.Status = 1
                         INNER JOIN ${TABLE_MEETING_BUILDING} AS MB ON MB.ID = MF.BuildingID
                    AND MB.Status = 1
                         INNER JOIN ${TABLE_MEETING_CAMPUS} AS MC ON MC.ID = MB.CampusID
                    AND MC.Status = 1
                         LEFT JOIN ${TABLE_PLC_PROFILES_MEETING_ROOM} AS PPMR ON MR.ID = PPMR.MeetingRoomID
                         LEFT JOIN ${TABLE_PLC_PROFILES} AS PP ON PP.ID = PPMR.ProfileID
                         LEFT JOIN ${TABLE_PLAYER} AS P ON CONCAT(',', MR.PlayerID, ',') LIKE CONCAT('%,', P.ID, ',%')
                WHERE MR.MeetingRoomTypeID = ${PLC_TYPE}
                GROUP BY MR.ID,
                         MR.Name,
                         MF.ID,
                         MF.Name,
                         MB.ID,
                         MB.Name,
                         MC.ID,
                         MC.Name,
                         PP.ID,
                         PP.Name
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

router.post("/", async (req, res, next) => {
    try {
        const result = await insertLine(req.body);
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

router.put("/", async (req, res, next) => {
    try {

        const {
            ID,
            Device,
            Floor,
            ProfileID
        } = req.body;

        const result = await db.query(
            `UPDATE ${TABLE_MEETING_ROOM} SET PlayerID = '${Device.join(',')}', FloorID = ${Floor} WHERE ID = ${ID}`
        );

        await db.query(`DELETE ${TABLE_PLC_PROFILES_MEETING_ROOM} WHERE MeetingRoomID = ${ID}`);

        await db.query(
            `INSERT ${TABLE_PLC_PROFILES_MEETING_ROOM} ( ProfileID, MeetingRoomID ) VALUES ( '${ProfileID}', '${ID}' )`
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
             FROM ${TABLE_MEETING_ROOM}
             WHERE ID = ${id}
             `
        );

        await db.query(`DELETE FROM ${TABLE_PLC_PROFILES_MEETING_ROOM} WHERE MeetingRoomID = ${id}`);

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
