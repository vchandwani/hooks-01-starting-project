import React, {useState, useEffect, useRef, useReducer} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [eneteredFilter, setEnteredFiler] = useState('');
  const inputRef = useRef();
  useEffect(()=> {
    const timer = setTimeout(()=>{
      if(eneteredFilter === inputRef.current.value){
        const query = eneteredFilter.length ===0 ?'': `?orderBy="title"&equalTo="${eneteredFilter}"`;
        fetch('https://react-hook-8e8ad.firebaseio.com/ingredients.json'+query)
        .then(response => response.json())
        .then(responseData => {
          const loadedIngredients =[];
          for(const key in responseData) {
            loadedIngredients.push({
              id: key,
              title: responseData[key].title,
              amount: responseData[key].amount
            });
          }
          onLoadIngredients(loadedIngredients);
        });
      }
    },500);
    //cleanup function, behave like component unmount
    return () => {}
    clearTimeout(timer);
  }, [eneteredFilter,onLoadIngredients,inputRef]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text"
          ref={inputRef}
            value={eneteredFilter}
            onChange={event => setEnteredFiler(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
