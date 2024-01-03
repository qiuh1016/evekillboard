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
    }

    start() {
        if (this.started) return;
        this.timer = setInterval(() => {
            const text = clipboard.readText();
            if (text === this.lastText) return;
            if (!this.checkName(text)) return;
            this.lastText = text;
            this.cb(text);
        }, this.interval);
        this.started = true;
    }

    stop() {
        if (!this.started) return;
        clearInterval(this.timer);
        this.started = false;
    }

    checkName(name: string) {
        if (name.length < 3 || name.length > 30) return false;
        if (name.includes('\n')) return false;
        return true;
    }

}