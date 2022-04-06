const axios = require("axios").default;
const { Webhook } = require("discord-webhook-node");
const discord = new Webhook(
  "https://discord.com/api/webhooks/955326233057566750/e-Tkq6mvxXYsx3Rqi3ttxDes76UXPpgk76Bnz5jF8_DwWgdNF-iNf7ZWdqi1nQnHO-zC"
);
const options = {
  headers: { "x-allthatnode-api-key": "ejJU9NP9KSmk0yDhS7CJhnedZ0G9gBwz" },
};
let blockHeight = 7141412;
const checkBlockInfo = async () => {
  await axios
    .get(
      `https://terra-mainnet-rpc.allthatnode.com:1317/blocks/${blockHeight}`,
      "",
      options
    )
    .then(async (res) => {
      if (res.data.status) {
        return;
      }
      // if (res.data.block.last_commit.signatures[4].validator_address === "") {
      msg = `Block Proposer\n ${res.data.block.header.validators_hash} \nNumber of txs: ${res.data.block.data.txs.length}\nTime: ${res.data.block.header.time}`;
      console.log(msg);
      await discord.info(
        "Missed block",
        `https://ping.pub/terra-luna/blocks/${res.data.block.header.height}`,
        msg
      );
      // }
      blockHeight++;
    });
  setTimeout(checkBlockInfo, 7000);
};

console.log("BLOCK | VALIDATOR | DATE | NUMBER OF TX");
checkBlockInfo();
