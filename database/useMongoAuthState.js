const fs = require("fs/promises");
const path = require("path");
const { WAProto: proto, initAuthCreds, BufferJSON } = require("@whiskeysockets/baileys");

const AuthSessionSchema = require("./schemas/AuthSession");

async function useMongoAuthState(sessionID, saveOnlyCreds) {
  const localFolder = path.join(process.cwd(), "sessions", sessionID);
  const localFile = (key) => path.join(localFolder, fixFileName(key) + ".json");

  if (saveOnlyCreds) await fs.mkdir(localFolder, { recursive: true });

  async function writeData(data, key) {
    const dataString = JSON.stringify(data, BufferJSON.replacer);

    if (saveOnlyCreds && key !== "creds") {
      await fs.writeFile(localFile(key), dataString);
      return;
    }

    await AuthSessionSchema.findOneAndUpdate(
      { sessionId: sessionID, keyId: key },
      { keyJson: dataString, updatedAt: new Date() },
      { upsert: true }
    );
  }

  async function readData(key) {
    try {
      let rawData = null;

      if (saveOnlyCreds && key !== "creds") {
        rawData = await fs.readFile(localFile(key), { encoding: "utf-8" });
      } else {
        const authKey = await AuthSessionSchema.findOne({
          sessionId: sessionID,
          keyId: key,
        });
        rawData = authKey?.keyJson ?? null;
      }

      const parsedData = JSON.parse(rawData, BufferJSON.reviver);
      return parsedData;
    } catch (error) {
      console.log("❌ readData", error.message);
      return null;
    }
  }

  async function removeData(key) {
    try {
      if (saveOnlyCreds && key !== "creds") {
        await fs.unlink(localFile(key));
      } else {
        await AuthSessionSchema.deleteOne({ sessionId: sessionID, keyId: key });
      }
    } catch (error) {
      // Não fazer nada em caso de erro
    }
  }

  let creds = await readData("creds");
  if (!creds) {
    creds = initAuthCreds();
    await writeData(creds, "creds");
  }

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {};
          await Promise.all(
            ids.map(async (id) => {
              let value = await readData(`${type}-${id}`);
              if (type === "app-state-sync-key" && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              data[id] = value;
            })
          );
          return data;
        },
        set: async (data) => {
          const tasks = [];
          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id];
              const key = `${category}-${id}`;
              tasks.push(value ? writeData(value, key) : removeData(key));
            }
          }
          await Promise.all(tasks);
        },
      },
    },
    saveCreds: () => {
      return writeData(creds, "creds");
    },
  };
}

const fixFileName = (file) => {
  if (!file) {
    return undefined;
  }
  const replacedSlash = file.replace(/\//g, "__");
  const replacedColon = replacedSlash.replace(/:/g, "-");
  return replacedColon;
};

module.exports = useMongoAuthState;