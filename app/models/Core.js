class Core {
    tableName;

    constructor(client) {
        this.client = client;
    }

    /**
     * Gets a specific instance
     * @param {number} id identifyer
     * @returns an instance
     */
    async findByPk(id) {
        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}" WHERE id = $1`,
            values: [id],
        };

        const result = await this.client.query(preparedQuery);

        if (!result.rows[0]) {
            return null;
        }

        return result.rows[0];
    }

    /**
     * Gets all instances
     * @param {Object} params an object with two keys : param and value
     * @returns an instance
     */
    async findAll(params) {
        let filter = '';
        const values = [];

        if (params?.$where) {
            const filters = [];
            let indexPlaceholder = 1;

            Object.entries(params.$where).forEach(([param, value]) => {
                if (param === '$or') {
                    const filtersOr = [];
                    Object.entries(value).forEach(([key, val]) => {
                        filtersOr.push(`"${key}" = $${indexPlaceholder}`);
                        values.push(val);
                        indexPlaceholder += 1;
                    });
                    filters.push(`(${filtersOr.join(' OR ')})`);
                } else {
                    filters.push(`"${param}" = $${indexPlaceholder}`);
                    values.push(value);
                    indexPlaceholder += 1;
                }
            });
            filter = `WHERE ${filters.join(' AND ')}`;
        }

        const preparedQuery = {
            text: `
                SELECT * FROM "${this.tableName}"
                ${filter}
            `,
            values,
        };

        const result = await this.client.query(preparedQuery);

        return result.rows;
    }

    /**
     * Creates an instances
     * @param {Object} inputData an object with keys matching the columns to fill
     * @returns an instance
     */
    async create(inputData) {
        const fields = [];
        const placeholders = [];
        const values = [];
        let indexPlaceholder = 1;

        Object.entries(inputData).forEach(([prop, value]) => {
            fields.push(`"${prop}"`);
            placeholders.push(`$${indexPlaceholder}`);
            indexPlaceholder += 1;
            values.push(value);
        });

        const preparedQuery = {
            text: `
                INSERT INTO "${this.tableName}"
                (${fields})
                VALUES (${placeholders})
                RETURNING *
            `,
            values,
        };

        const result = await this.client.query(preparedQuery);
        const row = result.rows[0];

        return row;
    }

    /**
     * Updates an instances
     * @param {Object} id identifyer of the line to update
     * @param {Object} inputData an object with keys matching the columns to fill
     * @returns an instance
     */
    async update({ id }, inputData) {
        const fieldsAndPlaceholders = [];
        let indexPlaceholder = 1;
        const values = [];

        Object.entries(inputData).forEach(([prop, value]) => {
            fieldsAndPlaceholders.push(`"${prop}" = $${indexPlaceholder}`);
            indexPlaceholder += 1;
            values.push(value);
        });

        values.push(id);

        const preparedQuery = {
            text: `
                UPDATE "${this.tableName}" SET
                ${fieldsAndPlaceholders},
                updated_at = now()
                WHERE id = $${indexPlaceholder}
                RETURNING *
            `,
            values,
        };

        const result = await this.client.query(preparedQuery);
        const row = result.rows[0];

        return row;
    }

     /**
     * Deletes an instances
     * @param {number} id identifyer of the line to delete
     * @returns an instance
     */
    async delete(id) {
        const result = await this.client.query(`DELETE FROM "${this.tableName}" WHERE id = $1`, [id]);
        return !!result.rowCount;
    }
}

module.exports = Core;