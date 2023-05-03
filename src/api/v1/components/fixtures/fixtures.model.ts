import uniqueValidator from 'mongoose-unique-validator';
import { Document, Schema, model, Types} from 'mongoose';

export interface IFixture extends Document {
  homeTeam: Types.ObjectId;
  awayTeam: Types.ObjectId;
  date: Date;
  venue: string;
  status: string;
  score: {
    homeTeamScore: number;
    awayTeamScore: number;
  };
  uniqueLink: string;
}

const fixtureSchema = new Schema({
  homeTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true},
  awayTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true},
  date: { type: Date, required: true},
  venue: { type: String, required: true},
  status: { type: String, enum: ['pending', 'completed'], default: 'pending'},
  score: {
    homeTeamScore: {type: Number,default: 0},
    awayTeamScore: {type: Number,default: 0},
  },
  uniqueLink: { type: String, required: true, unique: true },
}, {timestamps: true})

fixtureSchema.plugin(uniqueValidator);
export default model<IFixture>('Fixture', fixtureSchema);

