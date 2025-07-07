import serverless from "serverless-http";
import { app } from "../../src/infrastructure/web/server";

export const handler = serverless(app); 