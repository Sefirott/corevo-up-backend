const express = require("express");
const router = express.Router();
const db = require("@db");
const {
    TABLE_PLC_SENSORS,
    TABLE_PLC_SENSOR_GROUPS
} = require("@constants");

const insertSensor = (value, GroupID, SensorType) => {
    const {
        Device,
        DeviceIP,
        TagName,
        Address,
        DataType,
        RespectDataType,
        ClientAccess,
        Description
    } = value;
    if (Device) {
        return db.query(
            `
            INSERT INTO ${TABLE_PLC_SENSORS} (Device, DeviceIP, TagName, Address, DataType, RespectDataType, ClientAccess,
                                    "Desc", SensorType, GroupID)
            VALUES ('${Device}', '${DeviceIP}', '${TagName}', '${Address}', '${DataType}', '${RespectDataType}',
                    '${ClientAccess}', '${Description}', '${SensorType}', '${GroupID}')
        `
        );
    }
}

router.post("/group", async (req, res, next) => {
    try {
        const {
            Name
        } = req.body

        const result = await db.query(
            `INSERT INTO ${TABLE_PLC_SENSOR_GROUPS} (Name)
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
             FROM ${TABLE_PLC_SENSOR_GROUPS}
             WHERE ID = ${id}
             `
        );

        await db.query(`DELETE FROM ${TABLE_PLC_SENSORS} WHERE GroupID = ${id}`);

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
        const result = await db.query(`SELECT * FROM ${TABLE_PLC_SENSOR_GROUPS}`);
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
            `SELECT * FROM ${TABLE_PLC_SENSORS} WHERE GroupID IN (${inArray.length > 0 ? inArray.join(',') : 0})`
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
        const {recordset: result} = await db.query(
            `SELECT * FROM ${TABLE_PLC_SENSORS} WHERE GroupID = ${id}`
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
        const sensors = req.body
        let results = [];
        for (let sensorType in sensors) {
            if (sensorType !== 'GroupID' && sensors[sensorType].data.length > 0) {
                for (const value of sensors[sensorType].data) {
                    const result = await insertSensor(value, sensors.GroupID, parseInt(sensorType));
                    results.push(result);
                }
            }
        }
        res.json({
            success: true,
            results,
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
            Address,
            ClientAccess,
            Desc,
            Device,
            DeviceIP,
            DataType,
            RespectDataType,
            SensorType,
            TagName,
            GroupID
        } = req.body

        const result = await db.query(
            `
            UPDATE ${TABLE_PLC_SENSORS} 
            SET Address = '${Address}',
            ClientAccess = '${ClientAccess}',
            "Desc" = '${Desc}',
            Device = '${Device}',
            DeviceIP = '${DeviceIP}',
            DataType = '${DataType}',
            RespectDataType = ${RespectDataType},
            SensorType = ${SensorType},
            TagName = '${TagName}',
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
});

router.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            recordset: result
        } = await db.query(
            `
             DELETE
             FROM ${TABLE_PLC_SENSORS}
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
