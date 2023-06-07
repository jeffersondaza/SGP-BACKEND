import sgpClient from './clients/sgpClient';
import { endpoints } from './endpoints';

const sgpRepository = {
  reports: {
    uploadFile(formData: any) {
      return sgpClient.post(`http://localhost:8081${endpoints.uploadFile}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data; boundary=l3iPy71otz',
        },
      });
    },
  },
};

export default sgpRepository;
