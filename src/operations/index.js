export const sum = (...args) => args.reduce((acc, curr) => +acc + +curr);

export const avarage = (...args) => args.reduce((acc, curr) => +acc + +curr) / args.length;

export const concat = (...args) => args.reduce((acc, curr) => (acc + curr), '');

export const hyperlink = (arg) => arg;