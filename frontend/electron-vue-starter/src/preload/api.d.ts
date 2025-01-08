import { TestDto } from "../main/modules/test/test.dto";

export interface ApiInterface {
    /** 测试控制器 */
    TestController: {
        /** 测试接口1 */
        test: (params: TestDto) => Promise<string>;

        /** 测试接口2 */
        test2: (params: TestDto) => void
    };
}
