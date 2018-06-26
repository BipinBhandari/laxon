import chai from 'chai';
import { step } from 'mocha-steps';
import { getInstitution } from './fakedata';
import Zion from '..'
import mongoose from 'mongoose';

const expect = chai.expect;

const mongoConnection = function(mongoConnectionString){
  return new Promise((resolve, reject) => {
    mongoose.connect(mongoConnectionString, err => {
      if (err) reject(err);
      else resolve('DB connected!');
    });
  })
}

export const mongoConnectionString = `mongodb://localhost:27017/laxonTestDB`;

let zion;
describe('Testing instantiate function', () => {
  let db;
  let TestModel;
  let TestUser;
  let TestComment;
  let zion;

  before(async () => {
    const res = await mongoConnection(mongoConnectionString);
    console.log(res);

    zion = new Zion(mongoose);
    TestUser = zion.model(
      'TestUser',
      {
        attributes: {
          name: {
            type: String,
            required: true
          }
        }
      }
    );

    TestComment = zion.model(
      'TestMoment',
      {
        attributes: {
          description: {
            type: String,
            required: true
          },
          resources: [{ ref: 'TestUser' }]
        }
      }
    );

    TestModel = zion.model(
      'TestModal',
      {
        attributes: {
          name: {
            type: String,
            required: true
          }
        },
        beforeSave: function(next) {
          const user = this;
          user.name = 'Blab';
          next();
        }
      }
    );

    TestComment = zion.model(
      'TestComment',
      {
        attributes: {
          name: {
            type: String,
            required: true
          },
          commentedBy: {
            ref: 'TestUser'
          }
        }
      }
    );
  });

  step('check if beforeSave is working', async () => {
    const name = 'blab';
    const modelInstance = await TestModel.create({ name });
    expect(modelInstance.name).not.to.equal(name);
    expect(modelInstance.name).to.equal('Blab');
  });

  step('check if updatedAt and createAt are added', async () => {
    const name = 'blab';
    const modelInstance = await TestModel.create({ name });
    expect(modelInstance.createdAt).to.exist;
    expect(modelInstance.updatedAt).to.exist;
  });

  step('check if object ref is working', async () => {
    const user = { name: 'Bipin Bhandari' };
    const userInstance = await TestUser.create(user);
    const commentInstance = await TestComment.create({
      name: 'Comment 1',
      commentedBy: userInstance._id
    });
    const foundCommentInstance = await TestComment.findOne({ _id: commentInstance._id }).populate('commentedBy');
    expect(foundCommentInstance.commentedBy).to.exist;
    expect(String(foundCommentInstance.commentedBy._id)).to.equal(String(userInstance._id));
  });

  step('check if embedded schema works', async () => {
    const Toodler = zion.model(
      'Toodler',
      {
        attributes: {
          name: {
            type: String,
            required: true
          },
          children: [
            {
              attributes: {
                name: {
                  type: String,
                  required: true
                }
              }
            }
          ],
          contacts: {
            attributes: {
              officeNumber: {
                type: String
              },
              homeNumber: {
                type: String
              },
              mobileNumber: {
                type: String
              }
            }
          }
        }
      }
    );

    const toodler = await Toodler.create({
      name: 'Toodler 2',
      children: [{ name: 'Child 3' }, { name: 'Child 4' }],
      contacts: {
        officeNumber: '5202456',
        homeNumber: '5202456',
        mobileNumber: '984544344'
      }
    });

    expect(toodler.children).to.exist;
    expect(toodler.contacts).to.exist;

    expect(toodler.children).to.have.lengthOf(2);
    expect(toodler.contacts.officeNumber).to.equal('5202456');
    expect(toodler.contacts.homeNumber).to.equal('5202456');
    expect(toodler.contacts.mobileNumber).to.equal('984544344');

    expect(toodler.children.find(child => child.name === 'Child 3')).to.exist;
    expect(toodler.children.find(child => child.name === 'Child 4')).to.exist;
  });

  step('check if triple nested schema works', async () => {
    const TUser = zion.model(
      'TUserB',
      {
        attributes: {
          name: {
            type: String,
            required: true
          },
          preferences: {
            attributes: {
              devicePreferences: {
                attributes: {
                  devices: [
                    {
                      attributes: {
                        name: {
                          type: String,
                          required: true
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    );

    const tuser = await TUser.create({
      name: 'Yellow Bomb',
      preferences: {
        devicePreferences: {
          devices: [{ name: 'Nexus One' }]
        }
      }
    });

    expect(tuser.name).to.exist;
    expect(tuser.preferences).to.exist;
    expect(tuser.preferences.devicePreferences).to.exist;
    expect(tuser.preferences.devicePreferences.devices.length).to.equal(1);
    expect(tuser.preferences.devicePreferences.devices[0].name).to.equal('Nexus One');

    const tuser2 = await TUser.create({
      name: 'Yellow Bomb'
    });

    tuser2.preferences = {
      devicePreferences: {
        devices: [{ name: 'Nexus One Bablulasdas' }]
      }
    };

    await tuser2.save();

    const updatedTuser = await TUser.findOne({ _id: tuser2._id });

    updatedTuser.preferences.devicePreferences.devices.push({
      name: 'iPhone Yellow'
    });

    await updatedTuser.save();
    const updatedTuser3 = await TUser.findOne({ _id: tuser2._id });
    expect(updatedTuser3.preferences.devicePreferences.devices.length).to.equal(2);
  });
});
