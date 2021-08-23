const envConfig = {
  // dev: {
  //   BASE_API: 'https://10.0.0.50/api',
  //   FILE_PATH: 'https://10.0.0.50',
  // },
  beta: {
    BASE_API: 'http://120.27.222.210:8081/api',
    FILE_PATH: 'http://10.0.0.50',
  },
  stable: {
    BASE_API: 'http://120.27.222.210:8081/api',
    FILE_PATH: 'http://10.0.0.48',
  },
  fybeta: {
    BASE_API: 'http://120.27.222.210:8081/api',
    FILE_PATH: 'https://10.81.208.98',
  },
  fyprod: {
    BASE_API: 'http://120.27.222.210:8081/api',
    FILE_PATH: 'https://10.81.208.98',
  },
};

export default envConfig;
