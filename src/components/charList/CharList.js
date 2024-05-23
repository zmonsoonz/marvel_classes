import './charList.scss';
import MarvelService from '../../services/MarvelService';
import { Component } from 'react';
import PropTypes from 'prop-types';
import React from 'react';

class CharList extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }
    
    state = {
        chars: [],
        loading: true,
        error: false,
        offset: 300,
        newItemsLoading: false,
        charEnded: false,
    }
    marvelService = new MarvelService();
    
    onCharsLoaded = (charsServer) => {
        let ended = false;
        if (charsServer.length < 9 || this.state.offset >= 1555) {
            ended = true
        }
        this.setState(({chars, offset}) => ({
            chars: [...chars, ...charsServer],
            loading: false,
            newItemsLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
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

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnRef = (id) => {
        this.itemRefs.forEach(item => item.classList.remove("char__item_selected"));
        this.itemRefs[id].classList.add("char__item_selected");
        this.itemRefs[id].focus();
    }
    renderItems(chars) {
        const elems = chars.map(((data, i) => {
            const {name, thumbnail, id} = data
            let fit = 'cover'
            if (thumbnail.endsWith('image_not_available.jpg')) {
                fit = 'contain';
            }
            return (
                <li onClick={() => {this.props.onCharSelect(id); this.focusOnRef(i)}} ref={this.setRef} className="char__item" key={id}>
                    <img src={thumbnail} alt="abyss" style={{objectFit: fit}}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        }))
        return elems
    }


   componentDidMount = () => {
       this.marvelService.getAllCharacters().then(this.onCharsLoaded).catch(this.onError);
       console.log(this.myRef.Prototype)
    }

    onChangeOffset = () => {
        this.setState({newItemsLoading: true})
        this.marvelService.getAllCharacters(this.state.offset).then(this.onCharsLoaded).catch(this.onError);
    }
    render() {
        const {error, chars, loading, newItemsLoading, charEnded}  = this.state;
        return (
            <div className="char__list">
                <ul className="char__grid">
                {loading ? <img className="spinner" src={process.env.PUBLIC_URL + '/Rolling-1s-200px.gif'} alt="spin"></img> : 
                    error ? <h1 className="spinner">There is no such character</h1> : this.renderItems(chars)}
                </ul>
                <button disabled={newItemsLoading} style={{'display' : charEnded ? 'none' : 'block'}} onClick = {this.onChangeOffset} className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelect: PropTypes.func
}

export default CharList;