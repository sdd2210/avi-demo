import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigDataService {
    async updateConfigFile(data) {
        try {
            const formatData = JSON.stringify(data, null, 2);
            fs.writeFile(path.join(__dirname, '../..', 'storage/config/meeting_infor.json'), formatData, (err)=>{
                if(err){
                    console.log(err)
                }
            })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async getConfigFile() {
        try {
            const data = fs.readFileSync(path.join(__dirname, '../..', 'storage/config/meeting_infor.json'), { encoding: "utf-8" });
            const res = JSON.parse(data);
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }
}
