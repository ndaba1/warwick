import { Request, Response } from "express";

export const GET = async (req: Request, res: Response) => {
  res.json({ message: "Pretend like it's the first time :)" });
};
