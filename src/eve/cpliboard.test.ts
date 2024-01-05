import Clipboard from './clipboard';

describe('cpliboard', () => {
    it('should be right to check the name', () => {
        expect(Clipboard.checkName('Hello World')).toBe(true);
        expect(Clipboard.checkName('Hello_World')).toBe(false);
        expect(Clipboard.checkName('Hello\'World')).toBe(true);
        expect(Clipboard.checkName('Hello\nWorld')).toBe(false);
        expect(Clipboard.checkName('Hello World 2313123')).toBe(true);
        expect(Clipboard.checkName('Phantom-Flame Fleet No-12')).toBe(true);
    });
});