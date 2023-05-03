// noinspection ExceptionCaughtLocallyJS

import { ITeam } from "./teams.model";
import teamRepository from "./teams.repository";
import * as utils from "../../../../utils/helpers";
import { BadRequestError } from "../../../../utils/api-errors";

export = {
  async createTeam({ body }: { body: ITeam }) {
    try {
      await teamRepository.createTeam({teamData:body});
      return utils.responseData({status: 201, message: "Team created successfully"});
    } catch (err: any) {
      console.log({ err });
      throw new BadRequestError(err.message);
    }
  },

  async getAll({currentPage = 1, limit = 10, name, city, stadiumName, position, nationality}: 
    {currentPage?:any, limit?: any, name?:any, city?:any, stadiumName?: any, position?:any, nationality?:any}) {
    currentPage = +currentPage;
    limit = +limit > 200 ? 200 : +limit;
    const filter: any = {};

    if (name) {
      filter.name = { $regex: name.toString(), $options: 'i' };
    }

    if (city) {
      filter['stadium.location.city'] = { $regex: city.toString(), $options: 'i' };
    }

    if (stadiumName) {
      filter['stadium.name'] = { $regex: stadiumName.toString(), $options: 'i' };
    }

    if (position) {
      filter['players.position'] = { $regex: position.toString(), $options: 'i' };
    }

    if (nationality) {
      filter.$or = [
        { 'players.nationality': { $regex: nationality.toString(), $options: 'i' } },
        { 'manager.nationality': { $regex: nationality.toString(), $options: 'i' } }
      ]
    }

    console.log({filter})

    try {
      const [teams, totalTeams] = await teamRepository.getAll({currentPage, limit, filter});
      return utils.responseData({
        data: {
          teams: teams.map((team:any) => team.toObject({getters: true})),
          totalTeams, currentPage, totalPages: Math.ceil(totalTeams / limit)
        }
      });
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },

  async get({teamId}:{teamId:string}) {
    try {
      return await teamRepository.get({teamId});
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },

  async updateTeam({teamId, body}:{teamId: string, body:any}) {
    try {
      await teamRepository.updateTeam({teamId, teamData: body});
      return utils.responseData({message: 'Team successfully updated.'});
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },

  async deleteTeam({teamId}:{teamId: string}) {
    try {
      await teamRepository.deleteTeam({teamId});
      return utils.responseData({message: 'Team successfully deleted.'});
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },
};
