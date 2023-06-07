import sgpClient from "./clients/sgpClient"
import { endpoints } from "./endpoints"

const sgpRepository = {
    reports: {
        uploadFile(file: any){
            return sgpClient.post(endpoints.uploadFile,file);
        }
    },   
}

export default sgpRepository;