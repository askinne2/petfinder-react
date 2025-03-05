import { isWordPress } from './environment';

export const getBasePath = () => {
  return isWordPress() ? '' : '/';
};

export const getRoutePath = (path) => {
  const base = getBasePath();
  return `${base}${path}`.replace('//', '/');
};