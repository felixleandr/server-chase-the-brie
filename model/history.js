const { ObjectId } = require("mongodb");
const { getDb } = require("../config/mongo");

class History{
    // static histories(){ 
    //     return getDb().collection("histories")
    // }

    // static async findAll(){
    //     try {
    //         const histories = this.histories()
    //         return await histories.find().toArray()
    //     } catch (error) {
    //         throw error
    //     }
    // }

    // static async postHistory(input){
    //     try {
    //         const histories = this.histories()
    //         const newHistory = await histories.insertOne(input)
            
    //         return await newHistory.findOne({
    //             _id : new ObjectId(newHistory.insertedId)
    //         })
    //     } catch (error) {
    //         throw error
    //     }
    // }
}

module.exports = History;