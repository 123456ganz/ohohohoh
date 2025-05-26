require("dotenv").config();
const { ethers } = require("ethers");
const TelegramBot = require("node-telegram-bot-api");
const ABI = require("./abi/liquidlaunch_abi");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.LAUNCHPAD_ADDRESS, ABI, provider);
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });

let lastBlock = 0;

function formatUnitsPretty(value, decimals = 18) {
  return Number(ethers.formatUnits(value, decimals)).toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

function formatEtherPretty(value) {
  return Number(ethers.formatEther(value)).toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function startBot() {
  console.log("📡 Bot berjalan dan memantau event...");

  lastBlock = await provider.getBlockNumber();

  setInterval(async () => {
    try {
      const currentBlock = await provider.getBlockNumber();
      if (currentBlock <= lastBlock) return;

      const filter = {
        address: process.env.LAUNCHPAD_ADDRESS,
        fromBlock: lastBlock + 1,
        toBlock: currentBlock,
        topics: [
          ethers.id("TokenCreated(address,address,string,string,string,string,string,string,string,string,uint256,uint256,uint256,uint256,uint256,uint256,uint256)")
        ]
      };

      const logs = await provider.getLogs(filter);

      for (const log of logs) {
        let parsed;
        try {
          parsed = contract.interface.parseLog(log);
        } catch (err) {
          console.warn("⚠️ Gagal parsing log:", err);
          continue;
        }

        const {
          token,
          creator,
          name,
          symbol,
          image_uri,
          description,
          website,
          twitter,
          telegram,
          discord,
          creationTimestamp,
          startingLiquidity,
          currentHypeReserves,
          tokenReserves,
          totalSupply,
          currentPrice,
          initialPurchaseAmount
        } = parsed.args;

        const creatorHypeBalance = await provider.getBalance(creator);

        const tokenAbi = [
          "function decimals() view returns (uint8)",
          "function balanceOf(address) view returns (uint256)"
        ];
        const tokenContract = new ethers.Contract(token, tokenAbi, provider);

        let decimals = 18;
        try {
          decimals = await tokenContract.decimals();
        } catch (err) {
          console.warn("⚠️ Tidak bisa mengambil decimals, default ke 18");
        }

        const creatorTokenBalance = await tokenContract.balanceOf(creator);

        const msg = `
🚀 <b>New Token Launched!</b>

<b>🪙 Name:</b> ${escapeHtml(name)}
<b>🔤 Symbol:</b> ${escapeHtml(symbol)}
<b>📦 Total Supply:</b> ${formatUnitsPretty(totalSupply, decimals)}
<b>📬 Token Address:</b>
<code>${token}</code>

👤 <b>Creator Address:</b>
<code>${creator}</code>
<b>🎯 Tokens Held:</b> ${formatUnitsPretty(creatorTokenBalance, decimals)}
<b>💰 HYPE Balance:</b> ${formatEtherPretty(creatorHypeBalance)} HYPE
<b>🛒 Initial Purchase:</b> ${formatUnitsPretty(initialPurchaseAmount, decimals)} tokens

📝 <b>Description:</b> ${escapeHtml(description || 'Not available')}
🌐 <b>Website:</b> ${website || 'Not available'}
💬 <b>Telegram:</b> ${telegram || 'Not available'}
🐦 <b>Twitter:</b> ${twitter || 'Not available'}
`.trim();

        const inlineKeyboard = {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "🛒 LiquidLaunch", url: `https://liquidlaunch.app/token/${token}` }
              ],
              [
                { text: "🕵️ Scan Creator", url: `https://www.hyperscan.com/address/${creator}` },
                { text: "🔍 Scan Token", url: `https://www.hyperscan.com/token/${token}` }
              ],
              [
                { text: "🎯 Sniper Bot", url: `https://t.me/HyperEVMSniperBot?start=${token}` }
              ]
            ]
          },
          parse_mode: "HTML"
        };

        if (image_uri && image_uri.startsWith("http")) {
          await bot.sendPhoto(process.env.TELEGRAM_CHAT_ID, image_uri, {
            caption: msg,
            ...inlineKeyboard
          });
        } else {
          await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, msg, inlineKeyboard);
        }

        console.log(`[+] Token baru dikirim ke Telegram: ${name} (${symbol})`);
      }

      lastBlock = currentBlock;
    } catch (error) {
      console.error("❌ Gagal polling:", error);
    }
  }, process.env.POLL_INTERVAL * 1000 || 5000);
}

startBot();