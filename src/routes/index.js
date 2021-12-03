var express = require("express");
var router = express.Router();
const db = require("@db");
const axios = require('axios');

const {
    TABLE_PLC_TAGS,
    TABLE_PLC_TAG_GROUPS,
    TABLE_MEETING_ROOM,
    PLC_TYPE,
    FLOOR_ID,
    C_USER,
} = require("@constants");

const getDatasFromApiLink = (Link) => {
    try {
        return axios.get(Link)
    } catch (error) {
        console.error(error)
    }
}

const importFromApi = (Link, GroupID) => {
    return getDatasFromApiLink(Link)
        .then(async response => {
            let fieldDefinitions = null
            let rows = null
            if (GroupID && response.data.dataShape.fieldDefinitions) {
                fieldDefinitions = response.data.dataShape.fieldDefinitions;
                for (const [key, object] of Object.entries(fieldDefinitions)) {
                    // console.log(`${key} ${object.baseType}`);
                    let Name = object.name;
                    let Address = object.name;
                    let Type = object.baseType;
                    let Desc = object.description;
                    // console.log(`${Name} ${Address} ${Type} ${Desc} ${GroupID} ${Link}`);
                    let existsRows = await db.query(
                        `SELECT * FROM ${TABLE_PLC_TAGS}
                            WHERE Address = '${Address}' AND GroupID = ${GroupID}`
                    );
                    // console.log(existsRows.rowsAffected);
                    if (existsRows.rowsAffected > 0) {
                        await db.query(
                            `UPDATE ${TABLE_PLC_TAGS}
                                SET Name = '${Name}', Address = '${Address}', Type = '${Type}', "Desc" = '${Desc}', GroupID = ${GroupID}
                                WHERE Address = '${Address}' AND GroupID = ${GroupID}`
                        );
                    } else {
                        await db.query(
                            `INSERT INTO ${TABLE_PLC_TAGS} (Name, Address, Type, "Desc", GroupID)
                                VALUES ('${Name}', '${Address}', '${Type}', '${Desc}', ${GroupID})`
                        );
                    }
                }
                await db.query(
                    `UPDATE ${TABLE_PLC_TAG_GROUPS}
                                SET ApiLink = '${Link}'
                                WHERE ID = ${GroupID}`
                );
            }
            if (response.data.rows) {
                rows = response.data.rows;
                for (const [key, object] of Object.entries(rows)) {
                    // console.log(`${key} ${object.LineName}`);
                    let LineName = object.LineName;
                    let MeetingRoomTypeID = PLC_TYPE;
                    let PlcJson = JSON.stringify(object);
                    // console.log(`${LineName} ${MeetingRoomTypeID} ${PlcJson}`);
                    let existsRows = await db.query(
                        `SELECT * FROM ${TABLE_MEETING_ROOM}
                            WHERE Name = '${LineName}' AND MeetingRoomTypeID = ${MeetingRoomTypeID}`
                    );
                    // console.log(existsRows.rowsAffected);
                    if (existsRows.rowsAffected > 0) {
                        await db.query(
                            `UPDATE ${TABLE_MEETING_ROOM}
                                SET Name = '${LineName}', MUser = ${C_USER}, MDate = CURRENT_TIMESTAMP, Status = 1, MeetingRoomTypeID = ${MeetingRoomTypeID}, "PlcJson" = '${PlcJson}'
                                WHERE Name = '${LineName}' AND MeetingRoomTypeID = ${MeetingRoomTypeID}`
                        );
                    } else {
                        await db.query(
                            `INSERT INTO ${TABLE_MEETING_ROOM} (Name, CUser, CDate, Status, FloorID, MeetingRoomTypeID, "PlcJson")
                                VALUES ('${LineName}', ${C_USER}, CURRENT_TIMESTAMP, 1, ${FLOOR_ID}, ${MeetingRoomTypeID}, '${PlcJson}')`
                        );
                    }
                }
            }
            return {
                fieldDefinitions,
                rows,
            }
        })
        .catch(error => {
            console.error(error)
        })
}

router.get("/", function (req, res, next) {
    res.json({version: process.env.npm_package_version});
});

router.post("/importFromApi", async (req, res, next) => {
    try {
        const {
            Link,
            GroupID
        } = req.body
        const result = await importFromApi(Link, GroupID);
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

router.get("/cronTaskImportFromApi", async (req, res, next) => {
    try {
        let existsApiTagGroupsRows = await db.query(
            `SELECT * FROM ${TABLE_PLC_TAG_GROUPS}
                            WHERE ApiLink <> ''`
        );
        // console.log(existsApiTagGroupsRows);
        if (existsApiTagGroupsRows.rowsAffected > 0) {
            let apiTagGroups = existsApiTagGroupsRows.recordset;
            for (const [key, object] of Object.entries(apiTagGroups)) {
                // console.log(`${key} ${object}`);
                let ID = object.ID;
                let ApiLink = object.ApiLink;
                // console.log(`${ID} ${ApiLink}`);
                await importFromApi(ApiLink, ID);
            }
        }
        res.json({
            success: true,
            existsApiTagGroupsRows,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
});

module.exports = router;
