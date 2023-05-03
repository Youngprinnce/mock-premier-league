import Team, { ITeam } from "./teams.model";
import { TeamData } from "./teams.dto";

export = {
   /**
   * @description create new team
   * @param {Object} teamData - the data of the team to be created
   * @returns {Promise<ITeam>}
   */
  async createTeam({teamData}: {teamData:TeamData}): Promise<ITeam> {
    const existingTeam = await Team.findOne({name: teamData?.name});
    if (existingTeam) throw new Error('team with the same name exists, please choose another name');
    return await Team.create(teamData);
  },

  /**
   * @description get an array of teams
   * @param {Object} filter - what to filter the DB query with
   * @param {Number} limit - the number of items to return, if not provided, defaults to `10`, and `200` is max limit.
   * @param {Number} currentPage - the number of items to skip before starting to collect the result set, if not provided, defaults to `1`
   * @returns {Promise<[ITeam[], number]>}
   */
  getAll: async ({limit, currentPage, filter}: {limit:number, currentPage:number, filter:any}): Promise<[ITeam[], number]> => {
    return Promise.all([
      Team.find(filter).sort('-createdAt').skip((currentPage - 1) * limit).limit(limit), Team.countDocuments(filter)
    ])
  },

  /**
   * @description get a team by id
   * @param {String} teamId - team's objectId
   * @returns {Promise<ITeam>}
   */
  async get({teamId}:{teamId:string}): Promise<ITeam> {
    const team = await Team.findById(teamId);
    if (!team) throw new Error('no such team');
    return team.toObject({getters: true});
  },

   /**
   * @description updates team
   * @param {String} teamId - team's objectId
   * @param {Object} teamData - team's object data to be updated
   * @returns {Promise<ITeam>}
   */
  async updateTeam({teamId, teamData}:{teamData:ITeam, teamId:string}) {
    const existingTeam = await Team.findOne({name: teamData?.name});
    if (existingTeam && existingTeam.id !== teamId) throw new Error('team with the same name exists, please choose another name');
    return Team.findByIdAndUpdate(teamId, teamData, {new: true, omitUndefined: true});
  },

  /**
   * @description delete team
   * @param {String} teamId - team's objectId
   * @returns {Promise<null>}
   */
  deleteTeam: async ({teamId}:{teamId:string}): Promise<null> => await Team.findByIdAndDelete(teamId),
}


  