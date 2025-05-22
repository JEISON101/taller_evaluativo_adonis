import {Client} from 'pg';

const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password:'root',
    database:'gestion_equipos'
})
client.connect()
export default client;