// Implementation from https://www.educba.com/javascript-hash/

export const createCSSHashId = (css: string): string => {
  let hash = 0;
  for (let i = 0; i < css.length; i++) {
    const char = css.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return `uitk-${hash}`;
};
