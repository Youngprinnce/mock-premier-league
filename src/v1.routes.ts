// Import necessary modules
import glob from 'glob';
import path from "path";
import { Application, Router } from 'express';

// Mounts all routes defined in *.route.ts files in server/
const mountRoutes = () => {
  // Create empty array to store routes
  const routes: { url: string; route: Router }[]= [];

  // Store all files that end with .route.ts in the specified directory and subdirectories
  const files = glob.sync(`src/api/v1/**/*.route.ts`);

  // Iterate over each file
  for (let routeFilename of files) {
    try {
      // Create the url using the version, and the first part of the filename
      // For example: auth.route.ts will generate /v1/auth
      const version = routeFilename.split('api')[1].split('components')[0];
      const routeName = path.basename(routeFilename, '.route.ts');

      routeFilename = routeFilename.substring(routeFilename.indexOf('api'));
      
      // Import the router from the file and add it to the routes array
      const {router} = require(`./${routeFilename}`)
      routes.push({url: `${version}${routeName}`, route: router});

    } catch (error) {
      // If there is an error loading the route, log the error to the console
      console.error(`Error loading route file: ${routeFilename}:`, error);
    }
  }

  return routes;
}

// Mount all routes versions by adding them to the Express app
export default async ({ app }: { app: Application }) => {
  const routes = mountRoutes();
  for (const { url, route } of routes) {
    app.use(url, route);
  }
}


