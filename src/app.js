const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = {};

app.get("/repositories", (request, response) => {
  response.json(Object.values(repositories));
});

app.post("/repositories", (request, response) => {
  const {title, url, techs } = request.body;
  const id = uuidv4();
  
  const repository = {
    id,
    title,
    url,
    techs,
    likes:0
  }

  repositories[id]  = repository;
  response.json(repository);
});

const idMiddleware = (request,response,next) => {
  const {id} = request.params;
  if(!repositories[id]){
    return response.sendStatus(400);
  }
  next()
}

app.put("/repositories/:id", idMiddleware, (request, response) => {
  const {title, url, techs } = request.body;
  const {id} = request.params;
  repositories[id] = { ...repositories[id], title, url, techs};
  return response.json(repositories[id]);
});

app.delete("/repositories/:id", idMiddleware, (request, response) => {
  const {id} = request.params;
  delete repositories[id];
  return response.sendStatus(204)
});

app.post("/repositories/:id/like", idMiddleware, (request, response) => {
  const {id} = request.params;
  repositories[id].likes += 1;
  return response.json(repositories[id]);
});

module.exports = app;
