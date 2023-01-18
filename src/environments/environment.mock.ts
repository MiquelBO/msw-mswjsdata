import { USERS_API_MOCK  } from "src/mocks/handlers";
import { worker} from "src/mocks/browser";

worker.start();

export const environment = {
  production: false,
  API_USERS: USERS_API_MOCK 
};
