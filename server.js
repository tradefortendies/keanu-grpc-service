const path = require("path");
const Mali = require("mali");
const hl = require('highland')

const PROTO_PATH = path.resolve(__dirname, "./protos/keanu.proto");

// Sample data
let movies = [ 
  { id: 123, title: 'The Matrix', director: 'Wachowskis' },
  { id: 129, title: 'Point Break', director: 'Kathryn Bigelow' },
];

/**
 * Handler for the ListMovies RPC.
 * @param {object} ctx The request context provided by Mali.
 * @returns {Promise<void>}
 */
const listMovies = async ctx => {
  // Log that we received the request
  console.log("Received request => ListMovies()");

  // Set the response on the context
  ctx.res = {
    movies,
  };
};

/**
 * Handler for the InsertMovies RPC.
 * @param {object} ctx The request context provided by Mali.
 * @returns {Promise<void>}
 */
const insertMovies = async ctx => {
  // Log that we received the request
  console.log("Received request => InsertMovies()");

  // Obtain movie from the context request object
  // Push into existing array
  const movie = ctx.req;
  movies.push(movie);
  // Set the response on the context
  ctx.res = {};
};

/**
 * Handler for the InsertMovies RPC.
 * @param {object} ctx The request context provided by Mali.
 * @returns {Promise<void>}
 */
const streamMovies = async ctx => {
  // Log that we received the request
  console.log("Received request => StreamMovies()");

  ctx.res = hl(movies)
};

/**
 * Define the main entry point for the application.
 */
const main = () => {
  /**
   * Create a new instance of the Mali server.
   * We pass in the path to our Protocol Buffer definition,
   * and provide a friendly name for the service.
   * @type {Mali}
   */
  const app = new Mali(PROTO_PATH, "Keanu", {
    // These are gRPC native options that Mali passes down
    // to the underlying gRPC loader.
    defaults: true
  });

  app.use({
    listMovies,
    insertMovies,
    streamMovies,
  });

  // Start listening on localhost
  app.start("127.0.0.1:50051");

  // Log out that we're listening and ready for connections
  console.log("Listening...");
};

// Start the service and listen for connections
main();