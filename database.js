import 'dotenv/config';
import pg from 'pg';

// Get the Pool class from the pg module.
const { Pool } = pg;

export class TrailFinderDatabase {
  constructor(db_url) {
    this.dburl = db_url;
  }
  async connect() {
    // Create a new Pool. The Pool manages a set of connections to the database.
    // It will keep track of unused connections, and reuse them when new queries
    // are needed. The constructor requires a database URL to make the
    // connection. You can find the URL of your database by looking in Heroku
    // or you can run the following command in your terminal:
    //
    //  heroku pg:credentials:url -a APP_NAME
    //
    // Replace APP_NAME with the name of your app in Heroku.
    this.pool = new Pool({
      connectionString: this.dburl,
      ssl: { rejectUnauthorized: false }, // Required for Heroku connections
    });

    // Create the pool.
    this.client = await this.pool.connect();

    // Init the database.
    await this.init();
  }
  async init() {
    const queryText = `
      CREATE TABLE IF NOT EXISTS trails (
        name varchar(64) primary key,
        town varchar(64),
        description varchar(1920)
      );
      
      INSERT INTO
        trails(name, town, description)
      VALUES
        ('Robert Frost Trail', 'Amherst', 'Cool place'),
        ('Rattlesnake Gutter', 'Leverett', 'Rocks'),
        ('Mount Toby State Forest', 'Leverett', 'Waterfall')`;
    await this.client.query(queryText);
  }
  async createTrail(request, response) {
    console.log(JSON.stringify(request.body))
    const args = parse(request.body, "name", "town", "description");
    if ("error" in args) {
      response.status(400).json({ error: args.error });
    } else {
      // create ID or use trail name as ID?
      // const queryText = 'INSERT INTO trails (name, town, description) VALUES ($1, $2, $3) RETURNING *';
      // const res = await this.client.query(queryText, [args.name, args.town, args.description]);
      // return res.rows;
    }
  }
  async readTrail(request, response) {
    const args = parse(request.query, "name");
    if ("error" in args) {
      response.status(400).json({ error: args.error });
    } else {
      // const queryText = 'SELECT * FROM trails WHERE name = $1';
      // const res = await this.client.query(queryText, [args.name]);

      // dummy response
      response.status(200).json({ name: args.name, town: "Amherst", description: "This is a placeholder description of a trail until we get the database working.", imageURLs: ["https://photos.alltrails.com/eyJidWNrZXQiOiJhc3NldHMuYWxsdHJhaWxzLmNvbSIsImtleSI6InVwbG9hZHMvcGhvdG8vaW1hZ2UvMjc1NTQ1MTIvMmEyODczMmU3OGMzMmQ1MjA4ODVjMWJlZDEyMGNmODYuanBnIiwiZWRpdHMiOnsidG9Gb3JtYXQiOiJqcGVnIiwicmVzaXplIjp7IndpZHRoIjo1MDAsImhlaWdodCI6NTAwLCJmaXQiOiJpbnNpZGUifSwicm90YXRlIjpudWxsLCJqcGVnIjp7InRyZWxsaXNRdWFudGlzYXRpb24iOnRydWUsIm92ZXJzaG9vdERlcmluZ2luZyI6dHJ1ZSwib3B0aW1pc2VTY2FucyI6dHJ1ZSwicXVhbnRpc2F0aW9uVGFibGUiOjN9fX0=","https://photos.alltrails.com/eyJidWNrZXQiOiJhc3NldHMuYWxsdHJhaWxzLmNvbSIsImtleSI6InVwbG9hZHMvcGhvdG8vaW1hZ2UvNDE4NzIxMjUvYzgzYWI2ZjVlMWQxNmI5OWQ5MDcyMzk5MjQyZGQwY2IuanBnIiwiZWRpdHMiOnsidG9Gb3JtYXQiOiJqcGVnIiwicmVzaXplIjp7IndpZHRoIjoyMDQ4LCJoZWlnaHQiOjIwNDgsImZpdCI6Imluc2lkZSJ9LCJyb3RhdGUiOm51bGwsImpwZWciOnsidHJlbGxpc1F1YW50aXNhdGlvbiI6dHJ1ZSwib3ZlcnNob290RGVyaW5naW5nIjp0cnVlLCJvcHRpbWlzZVNjYW5zIjp0cnVlLCJxdWFudGlzYXRpb25UYWJsZSI6M319fQ==","https://photos.alltrails.com/eyJidWNrZXQiOiJhc3NldHMuYWxsdHJhaWxzLmNvbSIsImtleSI6InVwbG9hZHMvcGhvdG8vaW1hZ2UvMjEwMjY5NzMvNDJkZWE3NjM1NWE2OThlMWJlODYyZDUzYmUzNmQ5ZWEuanBnIiwiZWRpdHMiOnsidG9Gb3JtYXQiOiJqcGVnIiwicmVzaXplIjp7IndpZHRoIjo1MDAsImhlaWdodCI6NTAwLCJmaXQiOiJpbnNpZGUifSwicm90YXRlIjpudWxsLCJqcGVnIjp7InRyZWxsaXNRdWFudGlzYXRpb24iOnRydWUsIm92ZXJzaG9vdERlcmluZ2luZyI6dHJ1ZSwib3B0aW1pc2VTY2FucyI6dHJ1ZSwicXVhbnRpc2F0aW9uVGFibGUiOjN9fX0="]})
    }
  }
  async updateTrail(request, response) {
    const args = parse(request.query, "trail_id", "name", "town", "description");
    if ("error" in args) {
      response.status(400).json({ error: args.error });
    } else {
      // const queryText = `UPDATE trails SET town = $2, description = $3 WHERE name = $1`;
      // const res = await this.client.query(queryText, [args.name, args.town, args.description]);
    }
  }
  async deleteTrail(request, response) {
    const args = parse(request.query, "name");
    if ("error" in args) {
      response.status(400).json({ error: args.error });
    } else {
      // const queryText = 'DELETE FROM trails WHERE name = $1';
      // const res = await this.client.query(queryText, [args.name]);
    }
  }
  async createEvent(request, response) {
    console.log(JSON.stringify(request.body))
    const args = parse(request.body, "eid", "name", "time", "meetup", "uid", "description");
    if ("error" in args) {
      response.status(400).json({ error: args.error });
    } else {
      // const queryText =
        // 'INSERT INTO events (eid, name, time, meetup, uid, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      // const res = await this.client.query(queryText, [args.eid, args.name, args.time, args.meetup, args.uid, args.description]);
      // return res.rows;
      response.status(200).json({ eid: args.eid, name: args.name, time: args.time, meetup: args.meetup, uid: args.uid, description: args.description });
    }
  }
  async readEvent(request, response) {
    const args = parse(request.query, "eid");
    if ("error" in args) {
      response.status(400).json({ error: args.error });
    } else {
      // const queryText =
        // 'SELECT * FROM events WHERE eid = $1';
      // const res = await this.client.query(queryText, [args.eid]);
      response.status(200).json({ eid: args.eid});
    }
  }
  async updateEvent(request, response) {  // uid might not be needed up updateevent, as event should correspond to same host/uid
    const args = parse(request.body, "eid", "name", "time", "meetup", "uid", "description");
    if ("error" in args) {
      response.status(400).json({ error: args.error });
    } else {
      // const queryText =
        // `UPDATE events
        // SET name = $2, time = $3, meetup = $4, uid = $5, description = $6
        // WHERE eid = $1`;
      // const res = await this.client.query(queryText, [args.eid, args.name, args.time, args.meetup, args.uid, args.description]);
      response.status(200).json({ eid: args.eid, name: args.name, time: args.time, meetup: args.meetup, uid: args.uid, description: args.description });
    }
  }
  async deleteEvent(request, response) {
    const args = parse(request.query, "eid");
    if ("error" in args) {
      response.status(400).json({ error: args.error });
    } else {
      // const queryText = 'DELETE FROM events WHERE eid = $1';
      // const res = await this.client.query(queryText, [args.eid]);
      response.status(200).json({ eid: args.eid });
    }
  }
}

let dummyDB = {
 users: { 1:{ name:'', } },
 reviews: { 1:{ user:1, body:'', likes:[1,2,3] }, },
 trails: { 1:{ name:'', town:'', description:'', reviews:[1,2,3] } },
 events: { 1:{ }}
};

// crud helper
function parse(request, ...properties) {
  for (const property of properties)
   if ( !(property in request) )
    return { error: `missing argument: ${property}` };
  return request;
}

// All CRUD operations go below

// example crud operation
export async function createUser(request, response) {
  const args = parse(request.query, "name", "username", "password", "any other fields");
  if ("error" in args) {
    response.status(400).json({ error: args.error });
  } else {
    // handle valid response
  }
}