const glob = require('glob-promise');
const path = require('path');
const { promisify } = require('util');
const { promises, readFile, writeFile, existsSync } = require('fs');

const dataPath = path.resolve(__dirname, '../data');

const countries = require(path.join(dataPath, 'countries.json'));

const walkSubdivisions = async (currentPath, subdivision, callback) => {
  // console.log({ currentPath, subdivision });
  const { id } = subdivision;

  const subdivisionPath = path.join(currentPath, id);
  const exists = existsSync(subdivisionPath);

  // console.log({ subdivisionPath });

  if (!exists) {
    return;
  }
  
  let subdivisions;

  try {
    subdivisions = require(path.join(subdivisionPath, 'subdivisions.json'));
  } catch(err) {} // eslint-disable-line - suppress error

  if (subdivisions) {
    for (const code in subdivisions) {
      const sub = subdivisions[code];

      await walkSubdivisions(subdivisionPath, sub, callback);
    }

    return;
  }
  
  return await callback(currentPath, subdivision);
}

const build = async () => {
  
  for (const code in countries) {
    const country = countries[code];

    if (country.id) {
      await walkSubdivisions(dataPath, country, async (currentPath, subdivision) => {
        const subPath = path.join(currentPath, subdivision.id);
        const placesPath = path.join(subPath, 'places.json')
        if (existsSync(placesPath)) {
          const places = require(placesPath);
          const [_, relativePath] = subPath.split('/data/');
          const subdivisionParts = relativePath.split('/');

          const subOutputPath = subPath.replace('/data/', '/country/');

          if (!existsSync(subOutputPath)) {
            await promises.mkdir(subOutputPath, { recursive: true });
          }

          const output = {
            type: 'FeatureCollection',
            features: Object.entries(places).map(([code, place]) => ({
              type: 'Feature',
              geometry: {
                type: 'GeometryCollection',
                geometries: [{
                  type: 'Point',
                  coordinates: [
                    place.geo.longitude,
                    place.geo.latitude
                  ]
                }]
              },
              properties: {
                name: place.name,
                description: place.description,
              },
            }))
          };


          await promises.writeFile(
            path.join(subPath.replace('/data/', '/country/'), 'places.geojson'),
            JSON.stringify(output, null, 2),
          )
          console.log({ currentPath, places });
        }
      });
    }
  }

  // console.log({ countries });

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
