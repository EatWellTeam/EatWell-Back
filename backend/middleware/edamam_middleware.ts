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

  let products: any;
  try {
    products = JSON.parse(openaiResponse);
  } catch (error) {
    console.error("Error parsing OpenAI response: ", error);
    return res.status(500).json({ error: error.message });
  }
  const nutritionRequest = {
    ingredients: products,
  };

  req.body = nutritionRequest;

  next();
}

export default { forwardToNutrition };
