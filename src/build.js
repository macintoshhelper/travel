const glob = require('glob-promise');
const path = require('path');
const { promisify } = require('util');
const { readFile, existsSync } = require('fs');

const readFileAsync = promisify(readFile);

const dataPath = path.resolve(__dirname, '../data');

const countries = require(path.join(dataPath, 'countries.json'));

const build = async () => {
  for (const code in countries) {
    const value = countries[code];
    const { id } = value;

    const countryPath = path.join(dataPath, id);
    const exists = existsSync(countryPath);

    if (exists) {
      const subdivisions = require(path.join(countryPath, 'subdivisions.json'));

      for (const subCode in subdivisions) {
        const subdivision = subdivisions[subCode];
        const { id: subId } = subdivision;

        const subPath = path.join(dataPath, id, subId);
        const subExists = existsSync(subPath);
        if (subExists) {
          console.log({ code, subPath, id, subdivisions: require(path.join(subPath, 'subdivisions.json')) });
        }
      }

      // console.log({ code, subdivisions });
    }
  }

  console.log({ countries });

  return true;
};

build();

// glob('./data/**/*.json')
//   .then(contents => {
//     console.log({ contents });

//     contents.forEach((relativePath) => {
//       const path = relativePath.replace('./data/', '');

//       const foundCountries = countries.filter((country) => {
//         const { id } = country;
//         // if ( )
//       })

//       console.log({ path });
//     })
//   });
