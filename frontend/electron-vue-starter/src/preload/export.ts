import { ipcRenderer } from "electron";
import { TestDto } from "../main/modules/test/test.dto";
export const exportApi = {
    TestController: {
        test: (params: TestDto): Promise<any> => ipcRenderer.invoke('test/test1', params),
        test2: (params: TestDto): Promise<any> => ipcRenderer.invoke('test/test2', params)
    },
};
