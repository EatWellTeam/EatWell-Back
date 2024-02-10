// import { Document, Schema, Types, model } from "mongoose";
// export interface ILike extends Document {
//   user: Types.ObjectId;
//   post: Types.ObjectId;
//   createdAt: Date;
// }
// const likeSchema = new Schema<ILike>({
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   post: {
//     type: Schema.Types.ObjectId,
//     ref: "Post",
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });
// const LikeModel = model<ILike>("Like", likeSchema);
// export default LikeModel;
//# sourceMappingURL=likes_model.js.map