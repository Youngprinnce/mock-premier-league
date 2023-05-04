import teamService from "./teams.service";
import redisRepository from '../../../redis'
import { cacheData, getCache } from '../../../../utils/helpers';
import { Request, Response, NextFunction } from 'express';

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
      const cachedTeams = await getCache({req});
      if(cachedTeams) {
        const {status, ...rest} = cachedTeams
        return res.status(status).json(rest);
      }
      const {status, ...rest} = await teamService.getAll({currentPage, limit});
      await cacheData({req, data: {status, ...rest}})
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
      const cachedTeams = await getCache({req});
      if(cachedTeams) {
        const {status, ...rest} = cachedTeams
        return res.status(status).json(rest);
      }
      const {status, ...rest} = await teamService.getAll({name, city, position, nationality, stadiumName});
      await cacheData({req, data: {status, ...rest}})
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async get(req:Request, res:Response, next:NextFunction) {
    try {
      const cachedTeam = await getCache({req});
      if(cachedTeam) {
        return res.status(200).json({message: 'data fetched', success: true, team:cachedTeam})
      }
      const team = req.team;
      await cacheData({req, data: team});
      return res.status(200).json({message: 'data fetched', success: true, team})
    } catch (err) {
      return next(err);
    }
  }
}