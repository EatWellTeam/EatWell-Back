import { Request, Response } from "express";

const test1 = (req: Request, res: Response) => {
  return res.status(200).send("<h1>NICE</h1>");
};

export default { test1 };
