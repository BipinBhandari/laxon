import _isEmpty from 'ramda/src/isEmpty';

const sortParser = option => {
  if (!option || _isEmpty(option)) {
    return {};
  }

  const p = option.split(' ');
  if (p.length !== 2) {
    return {};
  }
  return {
    [[p[0]]]: p[1] === 'ASC' ? 1 : -1
  };
};

export default sortParser;