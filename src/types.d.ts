export interface ServiceInfo {
  info: string;
  version: string;
  endpoints: {
    pokemon: {
      [key: string]: string;
    };
    type: {
      [key: string]: string;
    };
    seeder: string;
  };
}
