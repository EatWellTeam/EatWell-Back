import { Request, Response, NextFunction } from "express";

async function forwardToNutrition(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const openaiResponse = res.locals.openaiResponse;
  console.log("openaiResponse in EdamamAPI: \n", openaiResponse);
  if (!openaiResponse) {
    return res.status(400).json({ error: "No response from OpenAI" });
  }

  const products = JSON.parse(openaiResponse);
  const nutritionRequest = {
    ingredients: products,
  };

  req.body = nutritionRequest;

  next();
}

export default { forwardToNutrition };
