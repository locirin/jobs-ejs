const Task = require("../models/Task");
const User = require("../models/User");
const faker = require("@faker-js/faker").fakerEN_US;
const FactoryBot = require("factory-bot");
require("dotenv").config();

const testUserPassword = faker.internet.password();
const factory = FactoryBot.factory;
const factoryAdapter = new FactoryBot.MongooseAdapter();
factory.setAdapter(factoryAdapter);

factory.define("task", Task, {
  owner: (ctx) => ctx.owner,
  title: () => "Sample Task",
  status: () => ["open", "done"][Math.floor(2 * Math.random())],
  notes: () => "SampleTask",
  dueDate: () => faker.date.soon(),
  familyCode: (ctx) => ctx.familyCode,
  assignedTo: () => null,
  assignedToName: () => "",
  createdByName: (ctx) => ctx.createdByName,
});

factory.define("user", User, {
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
});

const seed_db = async () => {
  let testUser = null;
  try {
    await Task.deleteMany({});
    await User.deleteMany({});
    testUser = await factory.create("user", {
      password: testUserPassword,
      familyCode: "test-family",
    });
    await factory.createMany("task", 20, {
      owner: testUser._id,
      familyCode: "test-family",
      createdByName: testUser.name,
    });
  } catch (e) {
    console.log("database error");
    console.log(e.message);
    throw e;
  }
  return testUser;
};

module.exports = { testUserPassword, factory, seed_db };
