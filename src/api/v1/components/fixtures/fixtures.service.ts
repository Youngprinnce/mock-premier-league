// noinspection ExceptionCaughtLocallyJS

import shortid from 'shortid';
import { IFixture } from "./fixtures.model";
import { ITeam } from "../teams/teams.model";
import { FixtureData } from "./fixtures.dto";
import * as utils from "../../../../utils/helpers";
import fixtureRepository from "./fixtures.repository";
import { BadRequestError } from "../../../../utils/api-errors";

export = {
  async create({ body }: { body: FixtureData }) {
    try {
      body.uniqueLink = shortid.generate();
      await fixtureRepository.create({ fixtureData: body });
      return utils.responseData({
        status: 201,
        message: "Fixture created successfully",
      });
    } catch (err: any) {
      console.log({ err });
      throw new BadRequestError(err.message);
    }
  },

  async getAll({currentPage = 1, limit = 10, date, teamId, status, venue}: {currentPage?:any, limit?: any, status?: any, date?:any, teamId?:any,venue?:any}) {
    currentPage = +currentPage;
    limit = +limit > 200 ? 200 : +limit;
    const filter: any = {};

    if (venue) {
      filter.venue = { $regex: venue, $options: 'i' };
    }

    if (date) {
      filter.date = { $gte: new Date(date.toString()) };
    }

    if (status) {
      filter.status = status.toString();
    }

    if(teamId) {
      filter.$or = [{ 'homeTeam': teamId },{ 'awayTeam': teamId }]
    }

    try {
      const [fixtures, totalFixtures] = await fixtureRepository.getAll({
        limit, currentPage, filter
      });
      return utils.responseData({
        data: {
          fixtures: fixtures.map(fixture => fixture.toObject({getters: true})),
          totalFixtures, currentPage, totalPages: Math.ceil(totalFixtures / limit),
        }
      });
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },

  async get({fixtureId}:{fixtureId:string}) {
    try {
      return await fixtureRepository.get({fixtureId});
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },

  async update({fixtureId, body}:{fixtureId: string, body:any}) {
    try {
      await fixtureRepository.update({fixtureId, fixtureData: body});
      return utils.responseData({message: 'Fixture successfully updated.'});
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },

  async updateScore({fixture, score, team}:{fixture:IFixture, score:number, team:ITeam}) {
    try {
      if(fixture.homeTeam.id === team.id) {
        fixture.score.homeTeamScore = score
      } else if (fixture.awayTeam.id === team.id) {
        fixture.score.awayTeamScore = score
      } else {
        throw new BadRequestError(`team not found in fixture`);
      }
      await fixtureRepository.update({fixtureId: fixture.id, fixtureData: fixture});
      return utils.responseData({message: 'Fixture successfully updated.'});
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },

  async fetchFixture({uniqueLink}:{uniqueLink:string}) {
    try {
      const fixture = await fixtureRepository.findOneFixture({filter: {uniqueLink}});
      return utils.responseData({data: {fixture}, success: true, message: 'Fixture fetched successfully' });
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },

  async delete({fixtureId}:{fixtureId: string}) {
    try {
      await fixtureRepository.delete({fixtureId});
      return utils.responseData({message: 'Fixture successfully deleted.'});
    } catch (err:any) {
      console.log({err});
      throw new BadRequestError(err.message);
    }
  },
};
