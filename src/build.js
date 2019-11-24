const glob = require('glob-promise');
const path = require('path');

const dataPath = path.resolve(__dirname, '../data');

const countries = require(path.join(dataPath, 'countries.json'));

glob('./data/**/*.json')
  .then(contents => {
    console.log({ contents });

    contents.forEach((relativePath) => {
      const path = relativePath.replace('./data/', '');

      const foundCountries = countries.filter((country) => {
        const { id } = country;
        // if ( )
      })

      console.log({ path });
    })
  });

console.log({ countries });
