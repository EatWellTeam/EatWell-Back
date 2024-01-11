import postModel, { IPost } from "../models/post_model";
import createController, { BaseController } from "./base_controller";

const PostController = createController<IPost>(postModel);

export default PostController;
