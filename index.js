const axios = require("axios").default;
const { Webhook } = require("discord-webhook-node");
const discord = new Webhook(
  "https://discord.com/api/webhooks/955326233057566750/e-Tkq6mvxXYsx3Rqi3ttxDes76UXPpgk76Bnz5jF8_DwWgdNF-iNf7ZWdqi1nQnHO-zC"
);
const options = {
  headers: { "x-allthatnode-api-key": "ejJU9NP9KSmk0yDhS7CJhnedZ0G9gBwz" },
};
let blockHeight;
const latestBlock = async () => {
  await axios
    .get(
      `https://terra-mainnet-rpc.allthatnode.com:1317/blocks/latest`,
      "",
      options
    )
    .then(async (res) => {
      blockHeight = res.data.block.header.height;
    });
};

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
      console.log(
        `Current blocks for checking: ${res.data.block.header.height}`
      );
      if (res.data.block.last_commit.signatures[4].validator_address === "") {
        msg = `Block Proposer: \nhttps://stake.id/?#/validator/${res.data.block.header.proposer_address} \nNumber of txs: ${res.data.block.data.txs.length}\nTime: ${res.data.block.header.time}`;
        log = `${res.data.block.header.height} | ${res.data.block.header.proposer_address} | ${res.data.block.data.txs.length} | ${res.data.block.header.time}`;
        console.log(log);
        await discord.info(
          `Missed block: ${res.data.block.header.height}`,
          `https://ping.pub/terra-luna/blocks/${res.data.block.header.height}`,
          msg
        );
      }
      blockHeight++;
    });
  setTimeout(checkBlockInfo, 5000);
};

latestBlock().then(() => {
  checkBlockInfo();
});
