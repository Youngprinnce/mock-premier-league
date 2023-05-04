import UserModel, { IUser } from "./users.model";

export = {
  /**
   * @description get user by a defined query
   * @param {Object} filter - what to filter the DB query with
   * @returns {Promise<IUser>}
   */
  findOneUser: async ({filter}:{filter:any}): Promise<IUser | null> => UserModel.findOne({...filter}),

  /**
   * @description get user by their userId
   * @param {String} userId - the userId of the user to fetch
   * @returns {Promise<IUser>}
   */
  async getUserById({userId}:{userId:string}): Promise<IUser> {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error('no such user');
    return user;
  },

  /**
   * @description get an array of users
   * @param {Object} filter - what to filter the DB query with
   * @param {Number} limit - the number of items to return, if not provided, defaults to `10`, and `200` is max limit.
   * @param {Number} currentPage - the number of items to skip before starting to collect the result set, if not provided, defaults to `1`
   * @returns {Promise<[IUser[], number]>}
   */
  getAll: async ({limit, currentPage, filter}: {limit:number, currentPage:number, filter:any}): Promise<[IUser[], number]> => {
    return Promise.all([
      UserModel.find(filter).sort('-createdAt').skip((currentPage - 1) * limit).limit(limit), UserModel.countDocuments(filter)
    ])
  },
}


  