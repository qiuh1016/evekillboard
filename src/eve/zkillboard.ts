interface SearchResult {
    id: number;
    name: string;
    type: string;
}

export default class Zkillboard {

    getCharacterUrlById(id: number) {
        return `https://zkillboard.com/character/${id}/`;
    }

    async getCharacterId(name: string) {
        const url = `https://zkillboard.com/autocomplete/${name}/`;
        const data = await fetch(url)
        const arr = await data.json() as Array<SearchResult>;
        if (arr.length === 0) {
            throw new Error('No results found');
        }
        if (arr[0].type !== 'character') {
            throw new Error('First result is not a character');
        }
        return arr[0].id;
    }

}