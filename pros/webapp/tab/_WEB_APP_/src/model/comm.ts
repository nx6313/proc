export class PageParams {
    cmd: string;
    params?: Array<any>;
    constructor(cmd, params?: Array<any>) {
        this.cmd = cmd;
        params ? this.params = params : {};
    }
}