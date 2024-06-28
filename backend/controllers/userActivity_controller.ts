import { BaseController } from "./base_controller";
import UserActivity, { IUserActivity } from "../models/userActivity_model";

class UserActivityController extends BaseController<IUserActivity> {
  constructor() {
    super(UserActivity);
  }
}
export default new UserActivityController();
