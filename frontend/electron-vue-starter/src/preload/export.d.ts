import { TestDto } from "../main/modules/test/test.dto";
export interface ExportInterface {
    TestController: {
        test: (params: TestDto) => Promise<any>;
        test2: (params: TestDto) => Promise<any>;
    };
}
