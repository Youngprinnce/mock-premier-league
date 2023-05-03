import { FixtureData } from "./fixtures.dto";
import Fixture, { IFixture } from "./fixtures.model";

export = {
  /**
   * @description creates new fixture object
   * @param {Object} fixtureData - data of the fixture to be created
   * @returns {Promise<IFixture>}
   */
  create: async ({fixtureData}:{fixtureData:FixtureData}): Promise<IFixture> => {
    const existingFeature = await Fixture.findOne({homeTeam: fixtureData.homeTeam, awayTeam: fixtureData.awayTeam});
    if (existingFeature) throw new Error('fixture with the same home ans away team exist, please choose another team');
    return await Fixture.create(fixtureData);
  },

  /**
   * @description get an array of fixtures
   * @param {Object} filter - what to filter the DB query with
   * @param {Number} limit - the number of items to return, if not provided, defaults to `10`, and `200` is max limit.
   * @param {Number} currentPage - the number of items to skip before starting to collect the result set, if not provided, defaults to `1`
   * @returns {Promise<[IFixture[], number]>} An array of FixtureT and a number representing the count of all documents that match the filter
   */
  getAll: async ({limit, currentPage, filter}:{limit:number, currentPage:number, filter:any}): Promise<[IFixture[], number]> => {
    return Promise.all([
      Fixture.find(filter).populate([{path: 'homeTeam'},{path: 'awayTeam'}])
        .sort('-createdAt').skip((currentPage - 1) * limit).limit(limit), Fixture.countDocuments(filter)
    ])
  },

  /**
   * @description get a fixture by id
   * @param {String} fixtureId - fixture's objectId
   * @returns {Promise<IFixture>}
   */
  async get({fixtureId}:{fixtureId:string}): Promise<IFixture> {
    const fixture = await Fixture.findById(fixtureId).populate([{path: 'homeTeam'},{path: 'awayTeam'}]);
    if (!fixture) throw new Error('no such fixture');
    return fixture.toObject({getters: true});
  },

  /**
   * @description updates fixture
   * @param {String} fixtureId - fixture's objectId
   * @param {Object} fixtureData - fixture's object data to be updated
   * @returns {Promise<IFixture | null>}
   */
  async update({fixtureId, fixtureData}:{fixtureData:IFixture, fixtureId:string}): Promise<IFixture | null> {
    return Fixture.findByIdAndUpdate(fixtureId, fixtureData, {omitUndefined: true, new: true});
  },

   /**
   * @description get a fixture by filtered object
   * @param {Object} filter - what to filter the DB query with
   * @returns {Promise<IFixture>}
   */
  async findOneFixture({filter}:{filter:any}): Promise<IFixture> {
    const fixture = await Fixture.findOne(filter).populate([{path: 'homeTeam'},{path: 'awayTeam'}]);
    if (!fixture) throw new Error('no such fixture');
    return fixture.toObject({getters: true}); 
  },

  delete: async ({fixtureId}:{fixtureId:string}): Promise<null> => await Fixture.findByIdAndDelete(fixtureId),
};


