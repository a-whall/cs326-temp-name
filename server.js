
import express from 'express';
import logger from 'morgan';
import { readFile, writeFile } from 'fs/promises';
import * as db from "./database.js";

const app = express();
const port = 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static('client'));

// All API calls should go below

/*

Here is an example of linking a route to an API call:

app.post('/user', async(request,response) => db.createUser(request, response));

*/


// All API calls should go above

app.listen(port, function() {
  console.log(`Server started on port ${port}.`);
});