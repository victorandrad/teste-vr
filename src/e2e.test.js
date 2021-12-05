import puppeteer from "puppeteer";

describe("App.tsx", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  it("Teste pokemon pagina 1", async () => {
    browser.describe

    // Testa primeira página
    await bulbasaurTest();
  });

  it("Teste pokemon pagina 4", async () => {
    browser.describe

    // Testa paginação buscando um pokemon da página 4
    await koffingTest();
  });

  it("Teste de busca de pokemon", async () => {
    browser.describe

    // Testa a busca de pokemon
    await searchTest();
  });

  const bulbasaurTest = async () => {
    await page.goto("http://localhost:3000");

    await page.waitForSelector(".pokemon-bulbasaur");
    await page.click('.pokemon-bulbasaur');

    await page.waitForSelector(".title-pokemon-bulbasaur");

    const text = await page.$eval(".title-pokemon-bulbasaur", (e) => e.textContent);

    expect(text).toContain("bulbasaur");
  }

  const koffingTest = async () => {
    await page.goto("http://localhost:3000");

    await page.waitForSelector(".ant-pagination-item-4");

    await page.click('.ant-pagination-item-4');


    await page.waitForSelector(".pokemon-koffing");

    await page.click('.pokemon-koffing');

    await page.waitForSelector(".title-pokemon-koffing");

    const text2 = await page.$eval(".title-pokemon-koffing", (e) => e.textContent);

    expect(text2).toContain("koffing");
  }

  const searchTest = async () => {
    await page.goto("http://localhost:3000");

    await page.waitForSelector(".pokemon-search .ant-input");

    await page.$eval('.pokemon-search .ant-input', el => el.value = 'chatot');

    await page.click('.ant-input-search-button');

    await page.waitForSelector(".title-pokemon-chatot");

    const text2 = await page.$eval(".title-pokemon-chatot", (e) => e.textContent);

    expect(text2).toContain("chatot");
  }

  afterAll(() => browser.close());
});