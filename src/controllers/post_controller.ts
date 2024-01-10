import postModel, { IPost } from "../models/post_model";
import createController from "./base_controller";

const studentController = createController<IPost>(postModel);

export default studentController;
