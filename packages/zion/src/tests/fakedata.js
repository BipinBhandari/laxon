import Chance from 'chance';

const chance = new Chance();

export const getInstitution = () => {
  return {
    name: chance.name(),
    address: chance.address(),
    phoneNumber: chance.phone(),
    facultyName: 'Faculty One',
    yearName: 'Year',
    groupName: 'Group',
    type: 'preschool'
  };
};
