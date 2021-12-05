const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Department CRUD', () => {
  // polaczenie z testowa baza danych
  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.log(err);
    }
  });
  // after(() => {
  //   mongoose.models = {};
  // });


  describe('Reading data', () => {

    before(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();

      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();
    });

    after(async () => {
      await Department.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const departments = await Department.find();
      const expectedLength = 2;
      expect(departments.length).to.be.equal(expectedLength);
    });
    it('should return proper document by "name" with "findOne" method', async () => {
      const departments = await Department.findOne({ name: 'Department #1' });
      const expectedName = 'Department #1';
      expect(departments.name).to.be.equal(expectedName);
    });
  });

  describe('Creating data', () => {

    after(async () => {
      await Department.deleteMany();
    });

    it('should insert new document with "insertOne" method', async () => {
      const department = new Department({ name: 'Department #1' });
      await department.save();
      const savedDepartment = await Department.findOne({ name: 'Department #1' });
      expect(savedDepartment).to.not.be.null;
    });

    it('should insert new document with "insertOne" method - method 2 ', async () => {
      const department = new Department({ name: 'Department #2' });
      await department.save();
      expect(department.isNew).to.be.false;
    });
  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();

      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();
    });

    afterEach(async () => {
      await Department.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Department.updateOne({ name: 'Department #1' }, { $set: { name: '=Department #1=' } });
      const updatedDepartment = await Department.findOne({name: "=Department #1="});
      expect(updatedDepartment).to.not.be.null;

    });

    it('should properly update one document with "save" method', async () => {
      const department = await Department.findOne({name: 'Department #1'});
      department.name = '=Department #1=';
      await department.save();

      const updatedDepartment = await Department.findOne({name: '=Department #1='});
      expect(updatedDepartment).to.not.be.null;
    });

    it('should properly update multiple document with "updateMany" method', async () => {
      await Department.updateMany({}, {$set: {name: 'Updated!!!'}});
      const updatedDepartment = await Department.find({name: 'Updated!!!'});
      expect(updatedDepartment.length).to.be.equal(2);


    });
  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();

      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();
    });

    afterEach(async () => {
      await Department.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Department.deleteOne({name: 'Department #1'});
      const deletedDepartment = await  Department.findOne({name: 'Department #1'});
      expect(deletedDepartment).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const department = await Department.findOne({name: 'Department #1'});
      department.remove();
      const removedDepartment = await Department.findOne({name: 'Department #1'});
      expect(removedDepartment).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Department.deleteMany();
      const deletedDepartment = await Department.find();
      expect(deletedDepartment.length).to.be.equal(0);
    });

  });





});