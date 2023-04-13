import Core from "./Core.js";
import { client } from "../db/database.js";
import Debug from 'debug';
const debug = Debug("model:card");

class Card extends Core {
    // client = dbClient;
    tableName = 'card';

    async findByUser(id) {
        const preparedQuery = {
            text : `SELECT * FROM card
            WHERE user_id = $1`,
            values: [id]
        }
        const result = await this.client.query(preparedQuery);

        return result.rows;
    }
};

module.exports = new Card(client);
// export default new Card();