const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee CRUD', () => {
  // polaczenie z testowa baza danych
  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });

      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();

      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();

      const testDepThree = new Department({ name: 'Department #3' });
      await testDepThree.save();

    } catch (err) {
      console.log(err);
    }
  });

  after(async () => {
    await Department.deleteMany();
  });

  describe('Reading data', () => {

    before(async () => {
      const dep1 = await Department.findOne({ name: 'Department #1' });
      const dep2 = await Department.findOne({ name: 'Department #2' });

      const testEmployOne = new Employee({ firstName: 'John', lastName: 'Bzik', department: dep1._id });
      await testEmployOne.save();

      const testEmployTwo = new Employee({ firstName: 'Amelia', lastName: 'Paczek', department: dep2._id });
      await testEmployTwo.save();
    });

    after(async () => {
      await Employee.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const employee = await Employee.find();
      const expectedLength = 2;
      expect(employee.length).to.be.equal(expectedLength);
    });
    it('should return proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John', lastName: 'Bzik' });
      const expectedFirstName = 'John';
      const expectedLastName = 'Bzik';
      expect(employee.firstName).to.be.equal(expectedFirstName);
      expect(employee.lastName).to.be.equal(expectedLastName);
    });
    it('should return all the data (employee and reference to department) with "find" method', async () => {

      const employeeRef = await Employee.find().populate({
        path: 'department',
        match: { name: { $eq: 'Department #2' } }
      });
      // console.log(employeeRef);
      let employee = [];
      for (let item of employeeRef) {
        if(item.department !== null){
          employee.push(item);
        }
      }
     expect(employee).to.not.be.null;;
    });
  });

  describe('Creating data', () => {

    after(async () => {
      await Employee.deleteMany();
    });

    it('should insert new document with "insertOne" method', async () => {
      const dep1 = await Department.findOne({ name: 'Department #1' });
      const employee = new Employee({ firstName: 'Mike', lastName: 'Kaluza', department: dep1._id });
      await employee.save();
      const savedEmployee = await Employee.findOne({ firstName: 'Mike', lastName: 'Kaluza' });
      expect(savedEmployee).to.not.be.null;
    });
  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const dep1 = await Department.findOne({ name: 'Department #1' });
      const dep2 = await Department.findOne({ name: 'Department #2' });

      const testEmployOne = new Employee({ firstName: 'John', lastName: 'Bzik', department: dep1._id });
      await testEmployOne.save();

      const testEmployTwo = new Employee({ firstName: 'Amelia', lastName: 'Paczek', department: dep2._id });
      await testEmployTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'Amelia', lastName: 'Paczek' }, { $set: { firstName: 'Amelianna', lastName: 'Paczka' } });
      const updatedEmployee = await Employee.findOne({ firstName: 'Amelianna', lastName: 'Paczka' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Amelia', lastName: 'Paczek' });
      employee.firstName = 'Amelianna';
      employee.lastName = 'Paczka';
      await employee.save();

      const updatedEmployee = await Employee.findOne({ firstName: 'Amelianna', lastName: 'Paczka' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple document with "updateMany" method', async () => {
      const dep3 = await Department.findOne({ name: 'Department #3' });
      await Employee.updateMany({}, { $set: { department: dep3._id } });
      // console.log(await Employee.find());
      const updatedEmployee = await Employee.find({ department: dep3._id });
      expect(updatedEmployee.length).to.be.equal(2);
    });
  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const dep1 = await Department.findOne({ name: 'Department #1' });
      const dep2 = await Department.findOne({ name: 'Department #2' });

      const testEmployOne = new Employee({ firstName: 'John', lastName: 'Bzik', department: dep1._id });
      await testEmployOne.save();

      const testEmployTwo = new Employee({ firstName: 'Amelia', lastName: 'Paczek', department: dep2._id });
      await testEmployTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'John', lastName: 'Bzik' });
      const deletedEmployee = await Employee.findOne({ firstName: 'John', lastName: 'Bzik' });
      expect(deletedEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John', lastName: 'Bzik' });
      employee.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'John', lastName: 'Bzik' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const deletedEmployee = await Employee.find();
      expect(deletedEmployee.length).to.be.equal(0);
    });

  });





});