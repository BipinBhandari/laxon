import lensProp from 'ramda/src/lensProp';
import set from 'ramda/src/set';

import model from './model';

class Zion {
    constructor(mongoose){
        this.mongoose = mongoose;
    }

    model(name, schemaMap, options = {}){
        options.mongoose = this.mongoose;
        return model(name, schemaMap, options);
    }
}

export default Zion;