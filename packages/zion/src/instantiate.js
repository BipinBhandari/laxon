import lensProp from 'ramda/src/lensProp';
import set from 'ramda/src/set';

import mongoose from '../../modules/db';
import model from './model';

export default (name, schemaMap, options = {}) => model(name, schemaMap, set(lensProp('mongoose'), mongoose)(options));
