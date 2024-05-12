import { config } from "dotenv";
config()

import Server from "./configs/server.js";
import addUsers from "./src/user/initUsers.js";

const server = new Server()

server.listen()
addUsers();