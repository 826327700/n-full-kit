import { ipcRenderer } from "electron";
import { TestDto } from "../main/modules/test/test.dto";

export const api = {
    TestController: {
        test: (params: TestDto): Promise<string> => ipcRenderer.invoke('test/test1', params),
        test2: (params: TestDto): void => ipcRenderer.send('test/test2', params),
    },
};
