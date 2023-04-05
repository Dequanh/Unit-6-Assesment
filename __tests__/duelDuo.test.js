const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  }),
  test('clicking the draw button displays', async () =>{
    await driver.get("http://localhost:8000");
    
    const clickDraw = await driver.findElement(By.xpath('//*[@id="draw"]'));

    await clickDraw.click()

    await driver.sleep(3000) 

    await driver.wait(until.elementLocated(By.xpath('//*[@id="choose-header"]')))

    await await driver.sleep(2000) 
  }),
  test('removing a bot from duo will return it to choices', async () =>{
    await driver.get("http://localhost:8000");

    const clickDraw = await driver.findElement(By.xpath('//*[@id="draw"]'));

    await clickDraw.click()

    await driver.sleep(3000) 

    const botClick = await driver.findElement(By.xpath('/html/body/section[1]/div/div[1]/button'));

    await botClick.click()

    await driver.sleep(3000)

    const duoClick = await driver.findElement(By.xpath('/html/body/section[2]/section[1]/div/div/button'))

    await duoClick.click()

    await driver.sleep(3000)

    await driver.wait(until.elementLocated(By.xpath('//*[@id="choices"]/div[5]')))
  })
});