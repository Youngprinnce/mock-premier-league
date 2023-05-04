import bcrypt from "bcryptjs";
import shortid from 'shortid';
import logger from '../../utils/logger';
import { faker } from '@faker-js/faker';
import usersModel from '../v1/components/users/users.model';
import teamsModel from '../v1/components/teams/teams.model';
import fixturesModel from '../v1/components/fixtures/fixtures.model';

const USERS_DATA = Array.from({ length: 6 }).map(
  (_: any, index: number) => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: bcrypt.hashSync('Password1!', 12),
    role: index % 2 == 0 ? 'admin' : 'user',
  }),
);

const premierLeagueTeams = [
  { name: 'Arsenal', stadium: 'Emirates Stadium' },
  { name: 'Aston Villa', stadium: 'Villa Park' },
  { name: 'Brentford', stadium: 'Brentford Community Stadium' },
  { name: 'Brighton & Hove Albion', stadium: 'Falmer Stadium' },
  { name: 'Burnley', stadium: 'Turf Moor' },
  { name: 'Chelsea', stadium: 'Stamford Bridge' },
  { name: 'Crystal Palace', stadium: 'Selhurst Park' },
  { name: 'Everton', stadium: 'Goodison Park' },
  { name: 'Leeds United', stadium: 'Elland Road' },
  { name: 'Leicester City', stadium: 'King Power Stadium' },
  { name: 'Liverpool', stadium: 'Anfield' },
  { name: 'Manchester City', stadium: 'Etihad Stadium' },
  { name: 'Manchester United', stadium: 'Old Trafford' },
  { name: 'Newcastle United', stadium: 'St. James\' Park' },
  { name: 'Norwich City', stadium: 'Carrow Road' },
  { name: 'Southampton', stadium: 'St. Mary\'s Stadium' },
  { name: 'Tottenham Hotspur', stadium: 'Tottenham Hotspur Stadium' },
  { name: 'Watford', stadium: 'Vicarage Road' },
  { name: 'West Ham United', stadium: 'London Stadium' },
  { name: 'Wolverhampton Wanderers', stadium: 'Molineux Stadium' }
];

const TEAMS_DATA = premierLeagueTeams.map((team: any) => {
  return {
    name: team.name,
    stadium: {
      name: team.stadium,
      location: {
        city: faker.address.city(),
        country: faker.address.country(),
      }
    },
    players: Array.from({ length: 3 }).map(
        (_: any, i: number) => ({
            name: faker.name.fullName(),
            position: i === 0 ? 'Defender' : i === 1 ? 'Midfielder' : 'Forward',
            nationality: faker.address.country()
        }),
    ),
    manager: {
        name: faker.name.fullName(),
        nationality: faker.address.country()
    }
  };
});

function generateRandomFutureDate() {
  const futureDate = new Date(Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)); // add random number of milliseconds between 0 and 7 days
  const isoString = futureDate.toISOString(); // convert to ISO format
  return isoString.slice(0, -5) + "Z"; // remove milliseconds and add "Z" suffix
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 6);
}

const seeder = async () => {
    try {
        const users = await usersModel.find({})
        if(users.length > 0) {
            logger.info("SKIPPING >> SEEDING FOR USERS, TEAMS & FIXTURES")
            return
        } 
        logger.info("READY TO SEED DATABASE WITH DATA!");
        
        const [_, teams] = await Promise.all([
            usersModel.insertMany(USERS_DATA),
            teamsModel.insertMany(TEAMS_DATA)
        ]);

        const FIXTURES_DATA = []
        for (let i = 0; i < teams.length; i += 2) {
            const fixtureStatus = i < teams.length - 2 ? 'pending' : 'completed';
            FIXTURES_DATA.push({
                homeTeam: teams[i]._id,
                awayTeam: teams[i + 1]._id,
                date: generateRandomFutureDate(),
                venue: teams[i].stadium.name,
                status: fixtureStatus,
                uniqueLink: `${shortid.generate()}`,
                score: {
                    homeTeamScore: generateRandomNumber(),
                    awayTeamScore: generateRandomNumber()
                }
            });
        }
        await fixturesModel.insertMany(FIXTURES_DATA)

        logger.info("SEEDING COMPLETED SUCCESSFULLY!"); 
    } catch (error:any) {
        logger.info("RESET USER AND TEAMS TABLE"); 
        await Promise.all([
           usersModel.deleteMany({}),
           teamsModel.deleteMany({})
        ]);
        logger.error(`[SEEDING FAILED]: ${error.message}`);
        process.exit(1);
    }
}

export default seeder;
    





