const { saveObject } = require("./aws_helper");
const prisma = require("./db");
const fs = require("fs");

const pageAssets = async () => {
  const page = await prisma.pages.findMany({});

  page.forEach(async (page) => {
    if (page.image && page.image.bucket.includes("public")) {
      const image_path = `${page.image.bucket}${page.image.key}`;
      const fileData = fs.readFileSync(image_path);
      const upload = await saveObject(page.image.key, fileData);
      if (upload) {
        const key = process.env.APP_NAME.toLowerCase() + page.image.key;
        const bucket = process.env.AWS_S3_BUCKET;
        await prisma.pages.update({
          where: { id: page.id },
          data: { image: { ...page.image, key, bucket } }
        });
        console.log(`---------------------Image upload of ${page.name} is completed ---------------`);

        removeFile(image_path);
      }
    }
  });
};

const gamesAssets = async () => {
  const games = await prisma.games.findMany({});

  games.forEach(async (game) => {
    if (game.image && game.image.bucket.includes("public")) {
      const image_path = `${game.image.bucket}${game.image.key}`;
      const fileData = fs.readFileSync(image_path);
      const upload = await saveObject(game.image.key, fileData);
      if (upload) {
        const key = process.env.APP_NAME.toLowerCase() + game.image.key;
        const bucket = process.env.AWS_S3_BUCKET;

        console.log(`-----------------Image upload of ${game.name} completed----------------`);
        await prisma.games.update({ where: { id: game.id }, data: { image: { ...game.image, key, bucket } } });

        removeFile(image_path);
      }
    }

    if (game.gallery) {
      for (let [index, imageKey] of game.gallery.key.entries()) {
        if (game.gallery.bucket[index].includes("public")) {
          const image_path = `${game.gallery.bucket[index]}${imageKey}`;
          const fileData = fs.readFileSync(image_path);
          const upload = await saveObject(imageKey, fileData);

          const bucket = game.gallery.bucket;
          const key = game.gallery.key;

          if (upload) {
            bucket[index] = process.env.AWS_S3_BUCKET;
            key[index] = process.env.APP_NAME.toLowerCase() + imageKey;

            await prisma.games.update({
              where: { id: game.id },
              data: {
                gallery: { ...game.gallery, key, bucket }
              }
            });

            console.log(`---------------------Gallery image upload of ${game.name} completed---------------------`);
            removeFile(image_path);
          }
        }
      }
    }
  });
};

const gameTypeAssets = async () => {
  const gameTypes = await prisma.gameTypes.findMany({});

  gameTypes.forEach(async (game_type) => {
    if (game_type.image && game_type.image.bucket.includes("public")) {
      const image_path = `${game_type.image.bucket}${game_type.image.key}`;

      const fileData = fs.readFileSync(image_path);
      const upload = await saveObject(game_type.image.key, fileData);

      if (upload) {
        const key = process.env.APP_NAME.toLowerCase() + game_type.image.key;
        const bucket = process.env.AWS_S3_BUCKET;

        await prisma.gameTypes.update({ where: { id: game_type.id }, data: { image: { ...game_type.image, key, bucket } } });
        console.log(`---------------------Image upload of ${game_type.name} is completed ---------------`);

        removeFile(image_path);
      }
    }
  });
};

(async () => {
  console.log("---------------- <Page> ----------------");
  await pageAssets();
  console.log("---------------- <Game> ----------------");
  await gamesAssets();
  console.log("---------------- <GameType> ----------------");
  await gameTypeAssets();
  console.log("---------------- <Promotions> ----------------");
})();

const removeFile = (path) => {
  fs.stat(path, function (err, stats) {
    if (err) {
      return console.error(err);
    }

    fs.unlink(path, function (err) {
      if (err) return console.log(err);
      console.log("File deleted successfully");
    });
  });
};
