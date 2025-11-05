import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";

const app = new Hono();

app.use("/*", cors());
app.use("/*", logger());

let votes = { up: 0, down: 0 };

app.get("/api/votes", (c) => {
  return c.json(votes);
});

app.post("/api/votes/:type", (c) => {
  const type = c.req.param("type");
  
  if (type === "up") {
    votes.up++;
  } else if (type === "down") {
    votes.down++;
  } else {
    return c.json({ error: "Invalid vote type" }, 400);
  }
  
  return c.json(votes);
});

app.delete("/api/votes", (c) => {
  votes = { up: 0, down: 0 };
  return c.json(votes);
});

export default app;