import postgres from 'postgres'

const sql = postgres({ host: '127.0.0.1', port: 5432, database: 'postgres', username: 'postgres' } as postgres.Options<{}>);

export default sql;