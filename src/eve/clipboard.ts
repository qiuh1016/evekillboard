import { clipboard } from "electron";

export default class Clipboard {

    private timer: NodeJS.Timeout;
    private cb: (name: string) => void;
    private started: boolean = false;
    private interval = 1000;
    private lastText = "";

    constructor(interval: number, cb: (name: string) => void) {
        this.interval = interval;
        this.cb = cb;
        this.lastText = clipboard.readText();
    }

    start() {
        if (this.started) return;
        this.started = true;
        this.timer = setInterval(() => {
            const text = clipboard.readText();
            if (text === this.lastText) return;
            if (!Clipboard.checkName(text)) return;
            this.lastText = text;
            this.cb(text);
        }, this.interval);
        return this;
    }

    stop() {
        if (!this.started) return;
        clearInterval(this.timer);
        this.started = false;
    }

    static checkName(name: string) {
        if (name.length < 3 || name.length > 50) return false;
        if (name.includes('\n')) return false;
        const pattern = /^[a-zA-Z0-9 ' -]+$/;
        return pattern.test(name);
    }

}