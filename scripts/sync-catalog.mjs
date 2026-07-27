import { mkdir, writeFile } from "node:fs/promises";

const collections = {
  whiskey: "whiskey",
  tequila: "tequila",
  vodka: "vodka",
  gin: "gin",
  cognac: "cognac-brandy",
  wine: "wine",
};

const catalog = {};

for (const [category, handle] of Object.entries(collections)) {
  const products = [];

  for (let page = 1; ; page += 1) {
    const url = `https://onlineliquor.com/collections/${handle}/products.json?limit=250&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Catalog request failed: ${response.status} ${url}`);
    const payload = await response.json();
    const batch = payload.products ?? [];
    if (batch.length === 0) break;

    products.push(...batch.flatMap((product) => {
      const image = product.images?.[0]?.src;
      if (!image) return [];
      return [{
        id: String(product.id),
        name: product.title,
        handle: product.handle,
        type: product.product_type || category,
        tags: Array.isArray(product.tags) ? product.tags : [],
        image,
        url: `https://onlineliquor.com/products/${product.handle}`,
      }];
    }));

    if (batch.length < 250) break;
  }

  catalog[category] = products;
  console.log(`${category}: ${products.length}`);
}

await mkdir(new URL("../app/data/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../app/data/catalog.json", import.meta.url),
  `${JSON.stringify(catalog)}\n`,
);
