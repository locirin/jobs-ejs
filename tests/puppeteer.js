const puppeteer = require("puppeteer");
require("../app");
const { seed_db, testUserPassword } = require("../util/seed_db");
const Task = require("../models/Task");

let testUser = null;

let page = null;
let browser = null;
// Launch the browser and open a new blank page
describe("task board puppeteer test", function () {
  before(async function () {
    this.timeout(10000);
    //await sleeper(5000)
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });
  after(async function () {
    this.timeout(5000);
    await browser.close();
  });
  describe("got to site", function () {
    it("should have completed a connection", async function () {});
  });
  describe("index page test", function () {
    this.timeout(10000);
    it("finds the index page logon link", async () => {
      this.logonLink = await page.waitForSelector(
        "a ::-p-text(Click this link to logon)",
      );
    });
    it("gets to the logon page", async () => {
      await this.logonLink.click();
      await page.waitForNavigation();
      const email = await page.waitForSelector('input[name="email"]');
    });
  });
  describe("logon page test", function () {
    this.timeout(20000);
    it("resolves all the fields", async () => {
      this.email = await page.waitForSelector('input[name="email"]');
      this.password = await page.waitForSelector('input[name="password"]');
      this.submit = await page.waitForSelector("button ::-p-text(Logon)");
    });
    it("sends the logon", async () => {
      testUser = await seed_db();
      await this.email.type(testUser.email);
      await this.password.type(testUserPassword);

      await this.submit.click();
      // await page.waitForTimeout(2000);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const currentUrl = await page.url();
      if (
        !currentUrl.includes("/family-code") &&
        !currentUrl.includes("/tasks")
      ) {
        throw new Error(`Unexpected URL after logon: ${currentUrl}`);
      }
    });
  });
  describe("puppeteer task operations", function () {
    this.timeout(10000);

    it("shows the tasks page with 20 seeded tasks", async () => {
      const rows = await page.$$("tbody tr");
      if (rows.length !== 20) {
        throw new Error(`Expected 20 tasks, got ${rows.length}`);
      }
    });
    it("add 1 more task so total becomes 21", async () => {
      await page.goto("http://localhost:3000/tasks/new");

      await page.type('input[name="title"]', "Puppeteer Task");
      await page.type('input[name="notes"]', "Test note");

      const createButton = await page.waitForSelector(
        "button ::-p-text(Create Task)",
      );
      await createButton.click();
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const count = await Task.countDocuments({ owner: testUser._id });
      if (count !== 21) {
        throw new Error(`Expected 21 tasks, got ${count}`);
      }
    });
  });
});
