import likesModel, { ILike } from "../models/likes_model";
import { BaseController } from "./base_controller";
class LikeController extends BaseController<ILike> {
  constructor() {
    super(likesModel);
  }
}

export default new LikeController();
