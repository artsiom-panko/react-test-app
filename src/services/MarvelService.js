class MarvelService {
  _apiBase = "https://gateway.marvel.com:443/v1/public/";
  _apiKey = "apikey=5f9e414a5bebc203d1c4431dc2724d10";
  _baseOffset = 210;

  getResource = async (url) => {
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error("error :(");
    }

    return await response.json();
  };

  getAllCharacters = async (offset = this._baseOffset) => {
    // debugger;
    const characters = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`
    );

    return characters.data.results.map(this._transformCharacter);
  };

  getCharacterById = async (id) => {
    const character = await this.getResource(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    );

    return this._transformCharacter(character.data.results[0]);
  };

  _transformCharacter = (character) => {
    return {
      id: character.id,
      name: character.name,
      description: character.description
        ? `${character.description.slice(0, 210)}...`
        : "There is no description for this character :(",
      thumbnail: `${character.thumbnail.path}.${character.thumbnail.extension}`,
      homepage: character.urls[0].url,
      wiki: character.urls[1].url,
      comics: character.comics.items,
    };
  };
}

export default MarvelService;
