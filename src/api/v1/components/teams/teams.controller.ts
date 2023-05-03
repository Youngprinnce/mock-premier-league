import { Request, Response, NextFunction } from 'express';
import teamService from "./teams.service";

export = {
  async createTeam(req:Request, res:Response, next:NextFunction) {
    const {body} = req;
    try {
      const {status, ...rest} = await teamService.createTeam({body});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async getAll(req:Request, res:Response, next:NextFunction) {
    let {currentPage, limit} = req.query;
    try {
      const {status, ...rest} = await teamService.getAll({currentPage, limit});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async loadTeam(req:Request, res:Response, next:NextFunction, teamId:string) {
    try {
      req.team = await teamService.get({teamId});
    } catch (err) {
      return next(err);
    }
    return next();
  },

  async updateTeam(req:Request,res:Response, next:NextFunction) {
    const {id: teamId} = req.team;
    const {body} = req;
    try {
      const {status, ...rest} = await teamService.updateTeam({teamId, body});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async deleteTeam(req:Request,res:Response, next:NextFunction) {
    const {id: teamId} = req.team;
    try {
      const {status, ...rest} = await teamService.deleteTeam({teamId});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async searchTeam(req:Request,res:Response, next:NextFunction) {
    const { name, city, position, nationality, stadiumName } = req.query;
    try {
      const {status, ...rest} = await teamService.getAll({name, city, position, nationality, stadiumName});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  get: (req:Request, res:Response) => res.status(200).json({message: 'data fetched', success: true, team: req.team}),
}