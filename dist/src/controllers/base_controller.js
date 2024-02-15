"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userActivity_model_1 = __importDefault(require("../models/userActivity_model"));
class BaseController {
    constructor(model) {
        console.log("Model type:", typeof model);
        console.log("Model value:", model);
        this.model = model;
    }
    // handleServerError(res: Response, error: Error) {}
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query.body ? { body: req.query.body } : {};
                const items = yield this.model.find(query);
                res.send(items);
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield this.model.findById(req.params.id);
                if (!item) {
                    res.status(404).json({ message: "Not Found" });
                    return;
                }
                res.status(200).send(item);
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const obj = yield this.model.create(req.body);
                if (obj) {
                    res.status(201).send(obj);
                }
                else {
                    res.status(402).send("Error in creating object");
                }
            }
            catch (err) {
                console.error(err.message);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    putById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedItem = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                if (!updatedItem) {
                    res.status(404).json({ message: "Not Found" });
                    return;
                }
                res.status(200).send(updatedItem);
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedItem = yield this.model.findByIdAndDelete(req.params.id);
                if (!deletedItem) {
                    res.status(404).json({ message: "Not Found" });
                    return;
                }
                const modelName = this.model.modelName;
                if (modelName === "Post") {
                    const ObjectId = mongoose_1.default.Types.ObjectId;
                    const userActivity = yield userActivity_model_1.default.findOne({ post: new ObjectId(req.params.id) });
                    if (userActivity) {
                        yield userActivity_model_1.default.findByIdAndDelete(userActivity._id);
                    }
                }
                res.status(200).json({ message: "Deleted successfully" });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.BaseController = BaseController;
const createController = (model) => {
    //console.log("Create Controller ===> " + model);
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=base_controller.js.map