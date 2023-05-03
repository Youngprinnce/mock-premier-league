export interface TeamData {
  name: string;
  stadium: {
    name: string;
    location: {
      city: string;
      country: string;
    };
  };
  players: {
    name: string;
    position: string;
    nationality: string;
  }[];
  manager: {
    name: string;
    nationality: string;
  };
}