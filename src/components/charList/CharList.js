import "./charList.scss";
import { React, Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";
import PropTypes from "prop-types";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";

class CharList extends Component {
  state = {
    characters: [],
    loading: true,
    additionalLoading: false,
    error: false,
    selectedCharacter: null,
    offset: 210,
    characterEnded: false,
  };

  charactersRefs = [];
  marvelService = new MarvelService();

  componentDidMount() {
    // debugger;
    console.log(this.state);
    this.onRequest();
  }

  setRef = (ref) => {
    this.charactersRefs.push(ref);
  };

  focusOnItem = (id) => {
    console.log(this.charactersRefs);
    this.charactersRefs.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    this.charactersRefs[id].classList.add("char__item_selected");
    this.charactersRefs[id].focus();
  };

  onRequest = (offset) => {
    this.onCharacterLoading();

    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharactersLoaded)
      .catch(this.onError);
  };

  onCharacterLoading = () => {
    this.setState({
      additionalLoading: true,
    });
  };

  onCharactersLoaded = (loadedCharacters) => {
    let ended = false;
    if (loadedCharacters.length < 9) {
      ended = true;
    }

    debugger;
    this.setState(({ offset, characters }) => ({
      characters: [...characters, ...loadedCharacters],
      loading: false,
      additionalLoading: false,
      offset: offset + 9,
      characterEnded: ended,
    }));
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  renderCharacters(characters) {
    const renderedCharacters = characters.map((character) => {
      return (
        <li
          className="char__item"
          key={character.id}
          ref={this.setRef}
          onClick={() => {
            this.focusOnItem(character.id);
            this.props.onCharacterSelected(character.id);
          }}
        >
          <img src={character.thumbnail} alt={character.name} />
          <div className="char__name">{character.name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{renderedCharacters}</ul>;
  }

  render() {
    const {
      characters,
      loading,
      error,
      offset,
      additionalLoading,
      characterEnded,
    } = this.state;

    const renderedCharacters = this.renderCharacters(characters);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? renderedCharacters : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={additionalLoading}
          style={{ display: characterEnded ? "none" : "block" }}
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  selectedCharacter: PropTypes.func.isRequired,
};

export default CharList;
