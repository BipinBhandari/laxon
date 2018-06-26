import shortid from 'shortid';
import R from 'ramda';
import _cloneDeep from 'lodash/cloneDeep';
import mongoose from 'mongoose';

import sortParser from './helpers/sortParser';

// Ramda Playground https://goo.gl/2UUd4e

class NoRecordUpdatedException extends Error {}

const defaultConf = {
  createdAt: true,
  updatedAt: true,
  shortId: true
};

const callbackMethods = ['beforeSave'];
const instanceMethods = ['toJSON'];

const globalMethods = {
  findWithPagination: function(query, options = {}) {
    const { limit, pageNumber } = options;
    let sort = sortParser(options.sort);
    const Model = this;

    return Model.find(query)
      .sort(sort)
      .limit(limit)
      .skip(limit * (pageNumber - 1));
  },

  findWithCursor: function(query, options = {}) {
    const { limit, after } = options;
    let sort = sortParser(options.sort);
    const Model = this;

    if (shortid.isValid(after)) {
      return Model.find({
        ...query,
        _id: { $gt: after }
      })
        .limit(limit)
        .sort(sort);
    } else {
      return Model.find(query)
        .limit(limit)
        .sort(sort);
    }
  },

  // eslint-disable-next-line no-unused-vars
  getNextPageFlag: async function(cursor, query = {}, options = {}) {
    if (!cursor) return 0;
    const Model = this;
    return Model.count({ ...query, _id: { $gt: cursor } });
  },

  find: function() {
    return this.find(...arguments);
  },

  findOne: function() {
    return this.findOne(...arguments);
  },

  getTotal: function(params) {
    return this.count(params);
  },

  create: async function(data) {
    const Model = this;
    const record = new Model(data);
    try {
      return await record.save();
    } catch (err) {
      if (err) {
        if (err.name === 'ValidationError') {
          const fieldErrors = [];
          for (const field in err.errors) {
            fieldErrors.push({
              field: field,
              message: err.errors[field].message
            });
          }

          err.errors = fieldErrors;
        } else {
          err.errors = err;
        }
      }

      throw err;
    }
  },

  update: async function(data) {
    const Model = this;
    try {
      let response;
      if (data.id) {
        const { id, ...fields } = data;
        response = await Model.update({ _id: id }, fields);
      } else {
        const { shortid, ...fields } = data;
        response = await Model.update({ shortid: shortid }, fields);
      }
      if (!response.n) throw new NoRecordUpdatedException('No records were modified.');
    } catch (err) {
      if (err) {
        if (err.name === 'ValidationError') {
          const fieldErrors = [];
          for (const field in err.errors) {
            fieldErrors.push({
              field: field,
              message: err.errors[field].message
            });
          }

          err.errors = fieldErrors;
        } else {
          err.errors = err;
        }
        if (err instanceof NoRecordUpdatedException) {
          err.errors = {
            _error: err.message
          };
        }
      }

      throw err;
    }
  }
};

const isNotFunc = v => R.not(typeof v === 'function');

const createSchema = attrs => new mongoose.Schema(attrs);

const combineVirtualFunctions = (funcs, schema) => {
  if (!funcs || !funcs.length) return schema;
  R.compose(R.map(d => (schema.methods[d[0]] = d[1])), R.filter(a => !R.contains(a[0], instanceMethods)))(funcs);
  //TODO Handle instance methods
  return schema;
};

const schemafyIfNested = obj => {
  if (obj.Object) {
    R.map(x =>
      R.ifElse(
        R.compose(R.has('attributes'), R.last),
        y => {
          y[1] = schemafy(y[1]);
          return y;
        },
        R.identity
      )(x)
    )(obj.Object);
  }

  if (obj.Array) {
    R.map(x => {
      if (x[1].length !== 1) throw new Error('Nested array schema should have only one child.');

      if (!R.has('ref', x[1][0])) {
        x[1] = [schemafy(x[1][0])];
      }
    })(obj.Array);

    obj.Object = R.concat(obj.Object ? obj.Object : [], obj.Array);
  }

  return obj;
};

const schemafy = schema =>
  R.compose(
    R.converge(combineVirtualFunctions, [
      R.view(R.lensProp('Function')),
      R.compose(createSchema, R.fromPairs, R.view(R.lensProp('Object')))
    ]),
    schemafyIfNested,
    R.groupBy(R.compose(R.type, R.last)),
    R.toPairs,
    alterCollectionRef
  )(schema.attributes);

const alterCollectionRef = R.ifElse(
  R.both(isNotFunc, R.either(R.is(Array), R.is(Object))),
  R.pipe(
    R.map(
      R.ifElse(
        R.allPass([isNotFunc, R.is(Object), R.has('ref')]),
        R.set(R.lensProp('type'), mongoose.Schema.Types.ObjectId),
        R.identity
      ),
      R.identity
    ),
    R.map(a => alterCollectionRef(a))
  ),
  R.identity
);

export default (name, _schemaMap, options) => {
  const { mongoose } = options;

  const schemaMap = _cloneDeep(_schemaMap);

  if (!name) throw new Error('No name of the model was provided');

  const opts = R.merge(defaultConf, options);
  if (opts.createdAt) schemaMap.attributes['createdAt'] = { type: Date, default: Date.now };
  if (opts.updatedAt) schemaMap.attributes['updatedAt'] = { type: Date, default: Date.now };
  if (opts.shortId) schemaMap.attributes['shortid'] = { type: String, default: shortid.generate, unique: true };

  const modelSchema = schemafy(schemaMap);
  if (schemaMap.beforeSave) modelSchema.pre('save', schemaMap.beforeSave);

  const Model = {
    name: name
  };

  Model._model = mongoose.model(name, modelSchema);

  R.pipe(R.toPairs, R.filter(a => a[1] instanceof Function && !R.contains(a[0], callbackMethods)))(schemaMap).map(
    method => (Model[method[0]] = method[1].bind(Model._model))
  );

  R.toPairs(globalMethods).forEach(method => (Model[method[0]] = method[1].bind(Model._model)));
  return Model;
};
