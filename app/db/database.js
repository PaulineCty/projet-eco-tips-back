import * as dotenv from 'dotenv';
dotenv.config();
import Debug from 'debug';
const debug = Debug("database");

import pkg from 'pg';
const {Pool} = pkg;

const client = new Pool();

client.connect();

export {client};