import { Plant } from "./interfaces";
/** PROBLEM: OpenFarm doesn't do icons yet.
 *  SOLUTION: Temporarily hard code icons on our end as a proof-of-concept
 *  until we work something out with OF.
 */
let TEMP_ICON_MAP: { [ofSlug: string]: string } = {
  "apple-tree": "/app-resources/img/icons/Apple-96.png",
  "asparagus": "/app-resources/img/icons/Asparagus-96.png",
  "avocado": "/app-resources/img/icons/Avocado-96.png",
  "banana-shrub": "/app-resources/img/icons/Banana-96.png",
  "barley": "/app-resources/img/icons/Barley-96.png",
  "beets": "/app-resources/img/icons/Beet-96.png",
  "broccoli": "/app-resources/img/icons/Broccoli-96.png",
  "cabbage": "/app-resources/img/icons/Cabbage-96.png",
  "cactus": "/app-resources/img/icons/Cactus-96.png",
  "carrots": "/app-resources/img/icons/Carrot-96.png",
  "celery": "/app-resources/img/icons/Celery-96.png",
  "cherry-tree": "/app-resources/img/icons/Cherry-96.png",
  "chilli-pepper": "/app-resources/img/icons/Chili-96.png Pepper",
  "lemon": "/app-resources/img/icons/Citrus-96.png",
  "coniferous-tree": "/app-resources/img/icons/Confierous-96.png Tree",
  "corn": "/app-resources/img/icons/Corn-96.png",
  "cucumber": "/app-resources/img/icons/Cucumber-96.png",
  "deciduous-tree": "/app-resources/img/icons/Deciduous-96.png Tree",
  "dragon-fruit": "/app-resources/img/icons/Dragon-96.png Fruit",
  "eggplant": "/app-resources/img/icons/Eggplant-96.png",
  "flowers": "/app-resources/img/icons/Flower-96.png",
  "garlic": "/app-resources/img/icons/Garlic-96.png",
  "grapes": "/app-resources/img/icons/Grapes-96.png",
  "grass": "/app-resources/img/icons/Grass-96.png",
  "hazelnut": "/app-resources/img/icons/Hazelnut-96.png",
  "hops": "/app-resources/img/icons/Hops-96.png",
  "kiwi": "/app-resources/img/icons/Kiwi-96.png",
  "kohlrabi": "/app-resources/img/icons/Kohlrabi-96.png",
  "leek": "/app-resources/img/icons/Leek-96.png",
  "lettuce": "/app-resources/img/icons/Lettuce-96.png",
  "maple": "/app-resources/img/icons/Maple-96.png leaf",
  "melon": "/app-resources/img/icons/Melon-96.png",
  "mushrooms": "/app-resources/img/icons/Mushroom-96.png",
  "Acorns": "/app-resources/img/icons/Nut-96.png",
  "olives": "/app-resources/img/icons/Olive-96.png",
  "onion": "/app-resources/img/icons/Onion-96.png",
  "palm-tree": "/app-resources/img/icons/Palm-96.png Tree",
  "paprika": "/app-resources/img/icons/Paprika-96.png",
  "peach": "/app-resources/img/icons/Peach-96.png",
  "peanut": "/app-resources/img/icons/Peanuts-96.png",
  "pear": "/app-resources/img/icons/Pear-96.png",
  "peas": "/app-resources/img/icons/Peas-96.png",
  "pineapple": "/app-resources/img/icons/Pineapple-96.png",
  "plum": "/app-resources/img/icons/Plum-96.png",
  "pomegranate": "/app-resources/img/icons/Pomegranate-96.png",
  "potato": "/app-resources/img/icons/Potato-96.png",
  "radish": "/app-resources/img/icons/Radish-96.png",
  "raspberry": "/app-resources/img/icons/Raspberry-96.png",
  "sesame": "/app-resources/img/icons/Sesame-96.png",
  "soy": "/app-resources/img/icons/Soy-96.png",
  "strawberry": "/app-resources/img/icons/Strawberry-96.png",
  "sweet-potato": "/app-resources/img/icons/Sweet-96.png",
  "tomato": "/app-resources/img/icons/Tomato-96.png",
  "watermelon": "/app-resources/img/icons/Watermelon-96.png",
  "wheat": "/app-resources/img/icons/Wheat-96.png",
  "not-set": "/app-resources/img/icons/Sprout-96.png"
};

export type PlantOptions = Partial<Plant>;

/** Factory function for Plant types. */
export function Plant(options: PlantOptions): Plant {
  let openfarm_slug = options.openfarm_slug || "not-set";
  let icon_url = TEMP_ICON_MAP[openfarm_slug] || TEMP_ICON_MAP["not-set"];
  return {
    id: options.id,
    planted_at: (options.planted_at || ""),
    img_url: (options.img_url || "http://placehold.it/200x150"),
    name: (options.name || "Untitled Plant"),
    x: (options.x || 0),
    y: (options.y || 0),
    planting_area_id: (options.planting_area_id || ""),
    icon_url,
    openfarm_slug
  };
}
