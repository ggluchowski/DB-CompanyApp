const expect = require('chai').expect;
const Employee = require('../employee.model.js');
const mongoose = require('mongoose');

describe('Employee', () => {
  it('Should throw an error if no "name" arg', () => {
    const dep = new Employee({}); // create new Employee, but don't set `firstName, lastName, department` attr value

    dep.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('Should throw an error if "firstName, lastName, department" is not a string', () => {
    const cases = [
      {
        firstName: {},
        lastName: {},
        department: {},
      },

      {
        firstName: [],
        lastName: [],
        department: [],
      },
    ];

    for (let arg of cases) {
      const firstName = arg.firstName;
      const lastName = arg.lastName;
      const department = arg.department;
      const dep = new Employee({ firstName, lastName, department });

      dep.validate(err => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.exist;
      });
    };
  });

  it('Should not throw an error if arg is good', () => {
    const cases = [
      {
        firstName: 'Jan',
        lastName: 'Pozytywka',
        department: 'Marketing',
      },

      {
        firstName: 'Piotr',
        lastName: 'Przybity',
        department: 'Testing',
      },
    ];

    for (let arg of cases) {
      const firstName = arg.firstName;
      const lastName = arg.lastName;
      const department = arg.department;
      const dep = new Employee({ firstName, lastName, department });

      dep.validate(err => {
        expect(err).to.not.exist;
        expect(err).to.not.exist;
        expect(err).to.not.exist;
      });
    };
  });

  after(() => {
    mongoose.models = {};
  });
});