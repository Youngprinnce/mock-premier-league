import { check, body } from "express-validator";

const stadiumValidation = (stadium:any) => {
  if(Object.prototype.toString.call(stadium) !== '[object Object]') throw new Error(`stadium should be an object`);
  if(!stadium.hasOwnProperty('name') || !stadium.hasOwnProperty('location')) throw new Error(`'stadium' object should have both the 'name' and 'location' fields`);
  if(Object.keys(stadium).length !== 2) throw new Error(`'stadium' object should only have two field, 'name' and 'location'`);
  if(Object.prototype.toString.call(stadium.location) !== '[object Object]') throw new Error(`stadium location should be an object`);
  if(!stadium.location.hasOwnProperty('city') || !stadium.location.hasOwnProperty('country')) throw new Error(`stadium 'location' object should have both the 'city' and 'country' fields`);
  if(Object.keys(stadium.location).length !== 2) throw new Error(`'stadium location' object should only have two field, 'city' and 'country'`);

  const {name, location: {city, country}} = stadium
  if(typeof name !== 'string' || name.length <= 0) throw new Error(`stadium name should be a string and not empty`);
  if(typeof city !== 'string' || city.length <= 0) throw new Error(`stadium location city should be a string and not empty`);
  if(typeof country !== 'string' || country.length <= 0) throw new Error(`stadium location country should be a string and not empty`);
  return stadium;
}

const playerValidation = (players:any) => {
  if (!Array.isArray(players)) throw new Error(`expected the value of 'players' to be an array of Object(s) with 'name', 'position' and 'nationality' as fields`);
  if (!players.length) throw new Error(`'players' should contain at least one element`);

  for (const player of players) {
    const {name, position, nationality} = player;
    if(!player.hasOwnProperty('name') || !player.hasOwnProperty('position') || !player.hasOwnProperty('nationality')) throw new Error(`'players' object should have 'name', 'position' and 'nationality' fields`);
    if(Object.keys(player).length !== 3) throw new Error(`'players' object should only have three field, 'name', 'nationality' and 'position'`);
    if(typeof name !== 'string' || name.length <= 0) throw new Error(`player name should be a string and not empty`);
    if(typeof position !== 'string' || position.length <= 0) throw new Error(`player position should be a string and not empty`);
    if(typeof nationality !== 'string' || nationality.length <= 0) throw new Error(`player nationality should be a string and not empty`);
    const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
    if (!positions.includes(position)) throw new Error(`player position can either be 'Goalkeeper', 'Defender', 'Midfielder' or 'Forward'`);
  }
  return players;
}

const managerValidation = (manager:any) => {
  if(Object.prototype.toString.call(manager) !== '[object Object]') throw new Error(`manager should be an object`);
  if(!manager.hasOwnProperty('name') || !manager.hasOwnProperty('nationality')) throw new Error(`'manager' object should have both the 'name' and 'nationality' fields`);
  if(Object.keys(manager).length !== 2) throw new Error(`'manager' object should only have two field, 'name' and 'nationality'`);

  const {name, nationality} = manager
  if(typeof name !== 'string' || name.length <= 0) throw new Error(`manager name should be a string and not empty`);
  if(typeof nationality !== 'string' || nationality.length <= 0) throw new Error(`manager nationality should be a string and not empty`);
  return manager;
}

const create = [
  check('name').isLength({min: 3}).withMessage('name cannot be empty.'),
  body('stadium', 'stadium field is required').custom(stadium => stadiumValidation(stadium)),
  body('players', 'players field is required').custom(players => playerValidation(players)),
  body('manager', 'manager field is required').custom(manager => managerValidation(manager)),
];

const update = [
  check('name').optional().isLength({min: 3}).withMessage('name cannot be empty.'),
  body('stadium', 'stadium field is required').optional({ checkFalsy: true })
    .custom(stadium => stadium ? stadiumValidation(stadium) : null),
  body('players', 'players field is required').optional({ checkFalsy: true })
    .custom(players => players ? playerValidation(players): null),
  body('manager', 'manager field is required').optional({ checkFalsy: true })
    .custom(manager => manager ? managerValidation(manager) : null),
];

export = {create, update}


