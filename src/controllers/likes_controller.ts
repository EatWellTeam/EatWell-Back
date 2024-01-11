import likesModel, { ILike } from "../models/likes_model";
import createController from "./base_controller";

const LikesController = createController<ILike>(likesModel);

export default LikesController;
