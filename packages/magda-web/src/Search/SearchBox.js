import React, { Component } from 'react';
import './SearchBox.css';

function SearchBox(props){
    return (
      <form className="search-box">
        <div className='search-input'>
        <input
          type="text"
          name="search"
          className='form-control'
          placeholder="Search"
          value={props.value}
          onChange={(e)=>{props.onChange(e.target.value)}}
          onKeyPress={props.onKeyPress}
          ref={(searchBox)=>{searchBox && searchBox.focus()}}
        />
        {props.value.length > 0 &&
          <button type='button' className='btn btn-clear-search' onClick={props.onClearSearch}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        }
        </div>
        <button onClick={props.onClickSearch} type='button' className="btn btn-search-icon"><i className="fa fa-search" aria-hidden="true"></i> </button>
      </form>
    );
}
SearchBox.propTypes = {onChange: React.PropTypes.func, value: React.PropTypes.string, onKeyPress: React.PropTypes.func};



export default SearchBox;
