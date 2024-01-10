import likesModel, { ILike } from "../models/likes_model";
import createController from "./base_controller";

const studentController = createController<ILike>(likesModel);

export default studentController;
