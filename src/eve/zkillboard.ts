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
        const url = `https://zkillboard.com/autocomplete/${encodeURIComponent(name)}/`;
        console.log(url);
        const data = await fetch(url, {
            method: 'GET',
            headers: {
                user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        })
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

new Zkillboard().getCharacterId('Vivian Taugrus')
    .then(id => console.log(id))
    .catch(e => console.error(e));
