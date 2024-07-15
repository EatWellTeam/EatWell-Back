import express from "express";
const router = express.Router();
import  setUpNutritionData  from "../controllers/edamam_api";


router.post("/get-nutrition", setUpNutritionData);
   

export default router;
