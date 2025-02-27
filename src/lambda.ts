import serverless from "serverless-http";
import app from "./index";

export const handler = serverless(app); // Wrap app for AWS Lambda
