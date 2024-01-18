
import Post,{IPost} from "../models/post_model";
import { BaseController } from "./base_controller";
class PostController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }
}

export default new PostController();

