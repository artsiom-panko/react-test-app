import "./charInfo.scss";
import { Component } from "react";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import Skeleton from "../skeleton/Skeleton";
import PropTypes from 'prop-types'

class CharInfo extends Component {
  state = {
    character: null,
    loading: false,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidUpdate(prevProps, prevState) {
    if (this.props.characterId !== prevProps.characterId) {
      this.updateCharacter();
    }
  }

  updateCharacter = () => {
    const { characterId } = this.props;

    if (!characterId) {
      return;
    }

    this.onCharacterLoading();
    this.marvelService
      .getCharacterById(characterId)
      .then(this.onCharacherLoaded)
      .catch(this.onError);
  };

  onCharacherLoaded = (character) => {
    this.setState({ character: character, loading: false });
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  onCharacterLoading = () => {
    this.setState({
      loading: true,
    });
  };

  render() {
    const { character, loading, error } = this.state;

    const skeleton = character || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !character) ? (
      <View character={character} />
    ) : null;

    return (
      <div className="char__info">
        {skeleton}
        {errorMessage}
        {spinner}
        {content}
      </div>
    );
  }
}

const View = ({ character }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = character;

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>

      <ul className="char__comics-list">
        {comics.lenght > 0 ? null : "There is no comics with this character :("}
        {comics.map((item, i) => {
          return (
            <li key={i} className="char__comics-item">
              {item.name}
            </li>
          );
        })}
      </ul>
    </>
  );
};

CharInfo.propTypes = {
  characterId: PropTypes.number
}

export default CharInfo;
