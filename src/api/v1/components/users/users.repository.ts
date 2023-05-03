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
}


  