import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const output_file = "./public/swagger_output.json";

if (fs.existsSync(output_file)) {
  fs.unlinkSync(output_file);
  fs.openSync(output_file, "w");
} else {
  fs.openSync(output_file, "w");
}

const api_endpoints: string[] = [
  "./src/backend/routes/game_category.route.ts",
  "./src/backend/routes/page.route.ts",
  "./src/backend/routes/game.route.ts",
  "./src/backend/routes/game_type.route.ts",
  "./src/backend/routes/page.route.ts"
];

const doc = {
  info: {
    version: "1.0.0",
    title: `${process.env.APP_NAME} APIs`,
    description: `Documentation of <b>${process.env.APP_NAME}</b> apis.`
  },
  servers: [
    {
      url: `${process.env.APP_URL}/api/v1`,
      description: "Main Server"
    }
  ],
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT"
    }
  },
  definitions: {
    GameTypeList: {
      success: true,
      data: [
        {
          id: "a5dfc069-8304-44c6-bb59-b7569655fb39",
          name: "Fish And Slots",
          slug: "fish-and-slots",
          image: {
            key: "/game_types/a5dfc069-8304-44c6-bb59-b7569655fb39~~6692580-motogp-1011-xbox-360-front-cover.jpg",
            mine: "image/jpeg",
            size: "102891",
            bucket: "public",
            filename: "6692580-motogp-1011-xbox-360-front-cover.jpg"
          },
          image_alternative_text: "fish-and-slots",
          description: "<p>Vero quia amet, culp.</p>",
          orders: 1,
          meta_title: "Meta Title",
          meta_description: "Meta Description",
          og_title: "Og Title",
          og_description: "Og Description",
          og_url: "Og Url",
          og_type: "WEBSITE",
          keywords: "fish, slog",
          cannonical_link: "Quia impedit exerci",
          createdAt: "2023-06-15T10:18:38.263Z",
          updatedAt: "2023-06-15T10:18:38.269Z"
        }
      ]
    },
    GameTypeDetail: {
      success: true,
      data: {
        id: "a5dfc069-8304-44c6-bb59-b7569655fb39",
        name: "Fish And Slots",
        slug: "fish-and-slots",
        image: {
          key: "/game_types/a5dfc069-8304-44c6-bb59-b7569655fb39~~6692580-motogp-1011-xbox-360-front-cover.jpg",
          mine: "image/jpeg",
          size: "102891",
          bucket: "public",
          filename: "6692580-motogp-1011-xbox-360-front-cover.jpg"
        },
        image_alternative_text: "fish-and-slots",
        description: "<p>Vero quia amet, culp.</p>",
        orders: 1,
        meta_title: "Meta Title",
        meta_description: "Meta Description",
        og_title: "Og Title",
        og_description: "Og Description",
        og_url: "Og Url",
        og_type: "WEBSITE",
        keywords: "fish, slog",
        cannonical_link: "Quia impedit exerci",
        createdAt: "2023-06-15T10:18:38.263Z",
        updatedAt: "2023-06-15T10:18:38.269Z"
      }
    },
    GameCategoryList: {
      success: true,
      data: [
        {
          id: "8ff3019a-7b64-4430-a7c1-0d5cf32cc8ad",
          name: "Popular",
          slug: "popular",
          createdAt: "2023-06-15T10:41:45.523Z",
          updatedAt: "2023-06-15T10:41:45.523Z"
        },
        {
          id: "0947e707-6100-4d6a-abd4-926e0b905f18",
          name: "Latest",
          slug: "latest",
          createdAt: "2023-06-15T10:41:50.430Z",
          updatedAt: "2023-06-15T10:41:50.430Z"
        }
      ]
    },
    GameList: {
      success: true,
      data: [
        {
          id: "220e32be-64b7-4f31-b2f7-9ff3f431157b",
          name: "Alladin Fortune",
          slug: "alladin-fortune",
          image: {
            key: "/game/220e32be-64b7-4f31-b2f7-9ff3f431157b~~fa8ca1cb-ac0b-4846-8128-bea9e3652276~~Aladdins_Fortune.jpg",
            mine: "image/jpeg",
            size: "61605",
            bucket: "public",
            filename:
              "fa8ca1cb-ac0b-4846-8128-bea9e3652276~~Aladdins_Fortune.jpg"
          },
          image_alternative_text: "alldine-fortune",
          description: "<p>Fugiat aliquam natus.</p>",
          orders: 2,
          meta_title: "Meta Title",
          meta_description: "Meta Description",
          og_title: "Og Title",
          og_description: "Og Description",
          og_url: "Og Url",
          og_type: "MOBILE",
          keywords: "alladine",
          canonical_link: "https://alladin.com/",
          game_type: "a5dfc069-8304-44c6-bb59-b7569655fb39",
          gallery: {
            key: [
              "/game_gallery/220e32be-64b7-4f31-b2f7-9ff3f431157b~~6692580-motogp-1011-xbox-360-front-cover.jpg",
              "/game_gallery/220e32be-64b7-4f31-b2f7-9ff3f431157b~~pexels-kindel-media-8566473 (1).jpg"
            ],
            mine: ["image/jpeg", "image/jpeg"],
            size: [102891, 74811],
            bucket: ["public", "public"],
            filename: [
              "6692580-motogp-1011-xbox-360-front-cover.jpg",
              "pexels-kindel-media-8566473 (1).jpg"
            ]
          },
          gallery_alternative_text: "alladine-gallery",
          youtube_link: "https://youtube.com",
          createdAt: "2023-06-15T10:51:09.416Z",
          updatedAt: "2023-06-15T10:51:09.479Z",
          GameTypes: {
            id: "a5dfc069-8304-44c6-bb59-b7569655fb39",
            name: "Fish And Slots",
            description: "<p>Vero quia amet, culp.</p>",
            image: {
              key: "/game_types/a5dfc069-8304-44c6-bb59-b7569655fb39~~6692580-motogp-1011-xbox-360-front-cover.jpg",
              mine: "image/jpeg",
              size: "102891",
              bucket: "public",
              filename: "6692580-motogp-1011-xbox-360-front-cover.jpg"
            },
            orders: 1,
            slug: "fish-and-slots"
          }
        }
      ]
    },
    GameDetail: {
      success: true,
      data: {
        id: "220e32be-64b7-4f31-b2f7-9ff3f431157b",
        name: "Alladin Fortune",
        slug: "alladin-fortune",
        image: {
          key: "/game/220e32be-64b7-4f31-b2f7-9ff3f431157b~~fa8ca1cb-ac0b-4846-8128-bea9e3652276~~Aladdins_Fortune.jpg",
          mine: "image/jpeg",
          size: "61605",
          bucket: "public",
          filename: "fa8ca1cb-ac0b-4846-8128-bea9e3652276~~Aladdins_Fortune.jpg"
        },
        image_alternative_text: "alldine-fortune",
        description: "<p>Fugiat aliquam natus.</p>",
        orders: 2,
        meta_title: "Meta Title",
        meta_description: "Meta Description",
        og_title: "Og Title",
        og_description: "Og Description",
        og_url: "Og Url",
        og_type: "MOBILE",
        keywords: "alladine",
        canonical_link: "https://alladin.com/",
        game_type: "a5dfc069-8304-44c6-bb59-b7569655fb39",
        gallery: {
          key: [
            "/game_gallery/220e32be-64b7-4f31-b2f7-9ff3f431157b~~6692580-motogp-1011-xbox-360-front-cover.jpg",
            "/game_gallery/220e32be-64b7-4f31-b2f7-9ff3f431157b~~pexels-kindel-media-8566473 (1).jpg"
          ],
          mine: ["image/jpeg", "image/jpeg"],
          size: [102891, 74811],
          bucket: ["public", "public"],
          filename: [
            "6692580-motogp-1011-xbox-360-front-cover.jpg",
            "pexels-kindel-media-8566473 (1).jpg"
          ]
        },
        gallery_alternative_text: "alladine-gallery",
        youtube_link: "https://youtube.com",
        createdAt: "2023-06-15T10:51:09.416Z",
        updatedAt: "2023-06-15T10:51:09.479Z",
        GameTypes: {
          id: "a5dfc069-8304-44c6-bb59-b7569655fb39",
          name: "Fish And Slots",
          description: "<p>Vero quia amet, culp.</p>",
          image: {
            key: "/game_types/a5dfc069-8304-44c6-bb59-b7569655fb39~~6692580-motogp-1011-xbox-360-front-cover.jpg",
            mine: "image/jpeg",
            size: "102891",
            bucket: "public",
            filename: "6692580-motogp-1011-xbox-360-front-cover.jpg"
          },
          orders: 1,
          slug: "fish-and-slots"
        }
      }
    },
    PageList: {
      success: true,
      data: [
        {
          id: "dd578552-87f8-4274-9d4c-48562b609ee7",
          name: "Home",
          image: null,
          image_alternative_text: "home",
          description:
            "<p>Multiple Game Developers in One Shop: We Have Contest Games, Sweepstakes Games, Skill-Based Games, and More The best part is that we have teams to support it all!</p>",
          og_title: "Play All Types of Game Online | Game Construct|",
          meta_title: "Play All Types of Game Online | Game Construct|",
          og_description:
            "Explore & Join to Play All Types of Game Online today and discover a world of fun and creativity @ gameconstruct.com",
          meta_description:
            "Explore & Join to Play All Types of Game Online today and discover a world of fun and creativity @ gameconstruct.com",
          keywords: "Game Online, gameconstruct",
          canonical_link: "https://gameconstruct.com/",
          og_url: "https://gameconstruct.com/",
          og_type: "WEBSITE",
          slug: "home",
          sections: null,
          meta_box: null,
          createdAt: "2023-04-25T06:39:42.557Z",
          updatedAt: "2023-04-25T06:39:42.557Z"
        }
      ]
    },
    PageDetail: {
      success: true,
      data: {
        id: "dd578552-87f8-4274-9d4c-48562b609ee7",
        name: "Home",
        image: null,
        image_alternative_text: "home",
        description:
          "<p>Multiple Game Developers in One Shop: We Have Contest Games, Sweepstakes Games, Skill-Based Games, and More The best part is that we have teams to support it all!</p>",
        og_title: "Play All Types of Game Online | Game Construct|",
        meta_title: "Play All Types of Game Online | Game Construct|",
        og_description:
          "Explore & Join to Play All Types of Game Online today and discover a world of fun and creativity @ gameconstruct.com",
        meta_description:
          "Explore & Join to Play All Types of Game Online today and discover a world of fun and creativity @ gameconstruct.com",
        keywords: "Game Online, gameconstruct",
        canonical_link: "https://gameconstruct.com/",
        og_url: "https://gameconstruct.com/",
        og_type: "WEBSITE",
        slug: "home",
        sections: null,
        meta_box: null,
        createdAt: "2023-04-25T06:39:42.557Z",
        updatedAt: "2023-04-25T06:39:42.557Z"
      }
    }
  }
};

swaggerAutogen({ openapi: "3.0.0" })(output_file, api_endpoints, doc);
