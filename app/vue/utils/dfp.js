function getDpfToken() {
  const key = '_dfp';
  if (window[key]) {
    return window[key].getToken();
  }
  return undefined;
}

function getBd({ scene = 1 } = {}) {
  return new Promise((resolve, reject) => {
    if (window.bd) {
      window.bd.rstAsync({
        params: {
          scene,
        },
        callback(data) {
          resolve(data);
        },
        timeout: 500,
      });
    } else {
      reject();
    }
  });
}

function getAllParams({ scene = 1 } = {}) {
  return getBd({ scene })
    .then(data => ({ srcStr: data, deviceToken: getDpfToken() }));
}

export { getDpfToken, getBd, getAllParams };
