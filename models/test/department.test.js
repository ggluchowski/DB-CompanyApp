const expect = require('chai').expect;
const Department = require('../department.model.js');
const mongoose = require('mongoose');

describe('Department', () => {
  it('Should throw an error if no "name" arg', () => {
    const dep = new Department({}); // create new Department, but don't set `name` attr value

    dep.validate(err => {
      expect(err.errors.name).to.exist;
    });
  });

  it('Should throw an error if "mame" is not a string', () => {
    const cases = [{}, []];
    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    };
  });

  it('Should throw an error if "name" length is shorter than 5 signs and longest than 20 signs', () => {
    const cases = ['HR', 'Dzial pisowni i interpunkcji'];
    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('Should not throw an error if "name" is good', () => {
    const cases = ['Marketing', 'Bezsennosci'];
    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });

  after(() => {
    mongoose.models = {};
  });
});
