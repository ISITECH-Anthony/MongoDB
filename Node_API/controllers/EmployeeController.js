import mongodb from "mongodb";
import { db } from "../config/database.js";

export const GetAll = async (req, res) => {
    // get all employees
    const users = await db.collection("employees").find().toArray()

    return res.status(200).json({
        message: "Employees",
        data: users
    });
}

export const FindOneById = async (req, res) => {
    // get one employee by id
    const user = await db.collection("employees").findOne({ _id: new mongodb.ObjectId(req.params.id) })

    if (!user) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    return res.status(200).json({
        message: "Employee",
        data: user
    });
}

export const CreateOne = async (req, res) => {
    // create one employee
    const result = await db.collection("employees").insertOne({
        name: req.body.name,
        age: req.body.age,
        job: req.body.job,
        salary: req.body.salary,
    })

    return res.status(200).json({
        message: "Employee created",
        data: result
    });
}

export const UpdateOneById = async (req, res) => {
    // update one employee by id
    const user = await db.collection('employees').updateOne(
        { _id: new mongodb.ObjectId(req.params.id) },
        {
            $set: {
                name: req.body.name,
                age: req.body.age,
                job: req.body.job,
                salary: req.body.salary,
            }
        }
    )

    return res.status(200).json({
        message: "Employee updated",
        data: user
    });
}

export const DeleteOne = async (req, res) => {
    // delete one employee
    const test = await db.collection('employees').deleteOne({ _id: new mongodb.ObjectId(req.params.id) })

    if (test.deletedCount == 0) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    return res.status(200).json({
        message: "Employee deleted"
    });
}