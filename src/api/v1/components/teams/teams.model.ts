import { Document, Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface IPlayer {
  name: string;
  position: string;
  nationality: string;
}

interface IStadiumLocation {
  city: string;
  country: string;
}

interface IStadium {
  name: string;
  location: IStadiumLocation;
}

interface IManager {
  name: string;
  nationality: string;
}

export interface ITeam extends Document {
  name: string;
  stadium: IStadium;
  players: IPlayer[];
  manager: IManager;
}

// interface ITeamModel extends Model<ITeam> {}

const teamSchema = new Schema({
  name: { type: String, required: true, unique: true },
  stadium: {
    name: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  players: [{
    name: { type: String, required: true },
    position: { type: String, required: true },
    nationality: { type: String, required: true },
  }],
  manager: {
    name: { type: String, required: true },
    nationality: { type: String, required: true },
  },
}, {timestamps: true});

teamSchema.plugin(uniqueValidator);
export default model<ITeam>('Team', teamSchema);




