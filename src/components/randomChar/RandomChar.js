import { Component } from 'react';
import './randomChar.scss';
import MarvelService from '../../services/MarvelService';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component{


    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService()

    componentDidMount = () => {
        this.updateChar();
    }
    
    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + (1011000));
        this.onCharLoading();
        this.marvelService.getCharacter(id).then(this.onCharLoaded).catch(this.onError);
    }

    render() {
        const {error, char, loading} = this.state;
        return (
            <div className="randomchar">
                {loading ? <img className="spinner" src={process.env.PUBLIC_URL + '/Rolling-1s-200px.gif'} alt="spin"></img> : 
                    error ? <h1 className="spinner">There is no such character</h1> :<View char={char}/>}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, thumbnail, homepage, wiki} = char;
    let {description} = char;
    let fit = 'cover';
    if (!description) {
        description = "There is no data about this character"
    }
    if (description.length > 230) {
        description = description.slice(0, 200) + "...";
    }
    if (thumbnail.endsWith('image_not_available.jpg')) {
        fit = 'contain';
    }
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={{objectFit: fit}}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )

}

export default RandomChar;