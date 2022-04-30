import express from 'express';
import upload from 'express-fileupload';
import logger from 'morgan';
import expressSession from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { TrailFinderDatabase } from "./database.js";

const { Strategy } = passportLocal;

// We will use __dirname later on to send files back to the client.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

class TrailFinderServer {
  constructor(dburl) {
    this.dburl = dburl;
    this.app = express();
    this.app.use(logger('dev'));
    this.app.use(upload());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static('client'));
    this.app.use(expressSession({ secret: process.env.SECRET || 'SECRET', resave: false, saveUninitialized: false }));
    passport.use(this.loginStrategy());
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((uid, done) => done(null, uid));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    return this;
  }

  async initRoutes() {
    this.app.get('/', function(req,res) { res.redirect('/homepage.html'); });
    this.app.post('/trail', this.db.createTrail.bind(this.db));
    this.app.post('/trail/image', this.db.createTrailImage.bind(this.db));
    this.app.get('/trail/image', this.db.readTrailImages.bind(this.db));
    this.app.get('/trail', this.db.readTrail.bind(this.db));
    this.app.get('/trail/browse', this.db.readTrails.bind(this.db));
    this.app.get('/trail/count', this.db.readTrailCount.bind(this.db));
    this.app.post('/review', this.checkLoggedIn, this.db.createReview.bind(this.db));
    this.app.get('/review', this.db.readReview.bind(this.db));
    this.app.delete('/review', this.db.deleteReview.bind(this.db));
    this.app.put('/review', this.db.updateReview.bind(this.db));
    this.app.post('/event', this.db.createEvent.bind(this.db));
    this.app.post('/event/image', this.db.createEventImage.bind(this.db));
    this.app.get('/event', this.db.readEvent.bind(this.db));
    this.app.get('/event/browse', this.db.readAllEvents.bind(this.db));
    this.app.put('/event', this.db.updateEvent.bind(this.db));
    this.app.delete('/event', this.db.deleteEvent.bind(this.db));
    this.app.post('/user', this.db.createUser.bind(this.db));
    this.app.get('/user', this.db.readUser.bind(this.db));
    this.app.get('/usercheck', this.db.readUser.bind(this.db));
    this.app.put('/user', this.db.updateUser.bind(this.db));
    this.app.delete('/user', this.db.deleteUser.bind(this.db));
    this.app.post('/login', passport.authenticate('local'), async (req, res) => {
      res.status(303).end();
    });
  }

  async initDb() {
    this.db = new TrailFinderDatabase(this.dburl);
    await this.db.connect();
  }

  async start() {
    await this.initDb();
    await this.initRoutes();
    const port = process.env.PORT || 3000;
    this.app.listen(port,_=> console.log(`Server started on port ${port}!`));
  }

  loginStrategy() {
    return new Strategy(async (username, password, done) => {
      const userExists = await this.db.checkUser(username);
      if (!userExists) {
        return done(null, false, { message: 'Invalid username' });
      }
      const validUserProfile = await this.db.attemptLogin(username, password);
      if (!validUserProfile) {
        await new Promise((r) => setTimeout(r, 2000)); // two second delay
        return done(null, false, { message: 'Wrong password' });
      }
      console.log('login successful');
      return done(null, username);
    });
  }

  // Custom middleware to check if the user is authenticated
  checkLoggedIn(request, response, next) {
    if (request.isAuthenticated()) {
      next(); // If authenticated, run the next route.
    } else {
      console.log('access to route denied')
      response.status(401).json({ status: 'must be logged in to perform this action' });
    }
  }
}

new TrailFinderServer(process.env.DATABASE_URL).start();