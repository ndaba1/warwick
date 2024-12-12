import { Request, Response } from "express";

export const GET = async (req: Request, res: Response) => {
  res.json({ message: "Ma meilleure ennemie!" });
};
