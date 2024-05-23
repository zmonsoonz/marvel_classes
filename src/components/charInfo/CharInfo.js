import { Component } from 'react';
import './charInfo.scss';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';
class CharInfo extends Component{
    
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar()
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }
    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }
        this.onCharLoading();
        this.marvelService.getCharacter(charId).then(this.onCharLoaded).catch(this.onError)
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    render() {
        const {char, loading, error} = this.state;
        return (
            <div className="char__info">
                {loading ? <img className="spinner" src={process.env.PUBLIC_URL + '/Rolling-1s-200px.gif'} alt="spin"></img> : 
                    error ? <h1 className="spinner">There is no such character</h1> : char ? <View char={char}/> : <Skeleton/>}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, thumbnail, homepage, wiki, description, comics} = char;
    let noDesc = "There is no data about this character";
    let noComics = null;
    if (comics.length === 0) {
        noComics = "There is no comics with this character";
    }
    let fit = 'cover'
    if (thumbnail.endsWith('image_not_available.jpg')) {
        fit = 'contain';
    }
    return (
        <>
        <div className="char__basics">
            <img style = {{objectFit: fit}} src={thumbnail} alt="abyss"/>
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
        <div className="char__descr">
            {description ? description : noDesc}
        </div>
        <div className="char__comics">Comics:</div>
        <ul className="char__comics-list">
        {
            comics.map((item,i) => {
                if (i >= 10) {
                    return (null)
                }
                return (
                    <li><a key = {i} href={item.resourceURI} className="char__comics-item">
                        {item.name}
                    </a></li>
                )
            })
        }
        {noComics}
        </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}
export default CharInfo;