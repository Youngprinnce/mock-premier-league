import { Document, Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser extends Document {
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
}

const userSchema = new Schema({
  password: {type: String, min: 8, required: true},
  firstName: {type: String, trim: true, required: true, index: true},
  lastName: {type: String, trim: true, required: true, index: true},
  email: {type: String, trim: true, required: true, unique: true, index: true},
  role: {type: String, default: 'user', enum: ['admin', 'user'], index: true},
}, {timestamps: true})

userSchema.plugin(uniqueValidator);
export default model<IUser>('User', userSchema);

