import {Client} from 'pg';

const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password:'root',
    database:'biblioteca_universitaria_adonis'
})
client.connect()
export default client;