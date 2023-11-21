const History = require("../model/history");

class HistoryController {
  // static async findAll(req, res, next) {
  //   try {
  //     let histories = await History.findAll()
  //     res.status(200).json(histories)
  //   } catch (error) {
  //     console.log(err);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }

  // static async createHistory(req, res, next) {
  //   try {
  //     const {players,winner,status,start,end } = req.body
  //     if (!players || !winner || !status || !start || !end){
  //       return res.status(400).json({ message: "Every field is required" });
  //     }
      
  //     const newHistory = await History.postHistory({
  //       ...req.body
  //     })

  //     res.status(201).json({ newHistory, message: `New history has been added` });
  //   } catch (error) {
  //     console.log(err);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }
}

module.exports = HistoryController;
