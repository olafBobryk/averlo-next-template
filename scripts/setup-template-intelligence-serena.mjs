#!/usr/bin/env node

import { main } from "./template-intelligence-serena-service.mjs";

await main(["setup", ...process.argv.slice(2)]);
