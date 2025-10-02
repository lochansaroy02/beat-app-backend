import { Request, Response } from "express";


export const loginMiddleware = (req: Request, res: Response, next: any) => {

    try {

        // login logic 

        next()
    } catch (error) {

    }

}