import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<ModelType> {
  model: Model<ModelType>;

  constructor(model: Model<ModelType>) {
    console.log("Model type:", typeof model);
    console.log("Model value:", model);
    this.model = model;
  }

  // handleServerError(res: Response, error: Error) {}

  async get(req: Request, res: Response) {
    try {
      const query = req.query.body ? { body: req.query.body } : {};
      const items = await this.model.find(query);
      res.send(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const item = await this.model.findById(req.params.id);
      if (!item) {
        res.status(404).json({ message: "Not Found" });
        return;
      }
      res.status(200).send(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async post(req: Request, res: Response) {
    console.log("Post method in base controller ===> " + req.body);
    try {
      const obj = await this.model.create(req.body);
      if(obj){
        res.status(201).send(obj);
      }
      else{
        res.status(500).send("Error in creating object");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async putById(req: Request, res: Response) {
    try {
      const updatedItem = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedItem) {
        res.status(404).json({ message: "Not Found" });
        return;
      }
      res.status(200).send(updatedItem);
    } catch (err) {
      // this.handleServerError(res, err);
    }
  }

  async deleteById(req: Request, res: Response) {
    try {
      const deletedItem = await this.model.findByIdAndDelete(req.params.id);
      if (!deletedItem) {
        res.status(404).json({ message: "Not Found" });
        return;
      }
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      // this.handleServerError(res, err);
    }
  }
}

const createController = <ModelType>(model: Model<ModelType>) => {
  console.log("Create Controller ===> " + model);

  return new BaseController<ModelType>(model);
};

export default createController;
