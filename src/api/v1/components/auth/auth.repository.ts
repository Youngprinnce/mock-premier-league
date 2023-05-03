import UserModel, { IUser } from "../users/users.model";
import usersRepository from "../users/users.repository";

export = {
  /**
 * @description Signup new user (admin || user)
 * @param {Object} UserData - the data of the user to be created
 * @returns {Promise<IUser>}
 */
  async signup({userData}: {userData:IUser}): Promise<IUser> {
    const existingUser = await UserModel.findOne({email: userData.email});
    if (existingUser) throw new Error('user exists, please login');
    return await UserModel.create(userData);
  },

  findOneUser: async ({filter}:{filter:any}) => usersRepository.findOneUser({filter}),
}


  