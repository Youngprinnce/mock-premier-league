import fixtureService from "./fixtures.service";
import { Request, Response, NextFunction } from 'express';

export = {
  async create(req:Request, res:Response, next:NextFunction) {
    const {body} = req;
    try {
      const {status, ...rest} = await fixtureService.create({body});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async getAll(req:Request, res:Response, next:NextFunction) {
    let {currentPage, limit, status: fixtureStatus} = req.query;
    try {
      const {status, ...rest} = await fixtureService.getAll({currentPage, limit, status:fixtureStatus});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async loadFixture(req:Request, res:Response, next:NextFunction, fixtureId:string) {
    try {
      req.fixture = await fixtureService.get({fixtureId});
    } catch (err) {
      return next(err);
    }
    return next();
  },

  get: (req:Request, res:Response) => res.status(200).json({message: 'data fetched', success: true, fixture: req.fixture}),

  async update(req:Request,res:Response, next:NextFunction) {
    const {id: fixtureId} = req.fixture;
    const {body} = req;
    try {
      const {status, ...rest} = await fixtureService.update({fixtureId, body});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async updateScore(req:Request,res:Response, next:NextFunction) {
    const {fixture, team} = req;
    const {score} = req.body;
    try {
      const {status, ...rest} = await fixtureService.updateScore({fixture, team, score});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async search(req:Request,res:Response, next:NextFunction) {
    const {currentPage, limit, teamId, status:statusQ, date, venue} = req.query;
    try {
      const {status, ...rest} = await fixtureService.getAll({currentPage, limit, teamId, status:statusQ, date, venue});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async fetchFixture(req:Request,res:Response, next:NextFunction) {
    const {uniqueLink} = req.params;
    try {
      const {status, ...rest} = await fixtureService.fetchFixture({uniqueLink});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

    async delete(req:Request,res:Response, next:NextFunction) {
      const {id: fixtureId} = req.fixture;
      try {
        const {status, ...rest} = await fixtureService.delete({fixtureId});
        return res.status(status).json(rest);
      } catch (err) {
        return next(err);
      }
  },
}
