import { MdsClient } from "bluemds";

async function run() {

  const client = new MdsClient({
    endpoint: "ws://localhost:3121/mds",
    secretKey: "zBf0erloqhAOf4UAaKQeeBtonVwvOiQ2okmWjmT3EpA=",
    store: "self",
    numLanes: 4,
  });
  
  await client.init();
  
  console.log("init done");
  
}

run();
