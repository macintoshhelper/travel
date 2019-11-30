// @flow

type Geo = {
  longitude: number,
  latitude: number,
};

type PlaceType = 'restaurant' | 'pizzeria';

type Address = {
  addressCountry: string,
};

type Place = {
  name: string,
  description: string,
  geo: Geo,
  type: PlaceType[],
  address: Address,
};
