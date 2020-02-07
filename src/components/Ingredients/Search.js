import React, {useState, useEffect, useRef, useReducer} from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';
import useHttp from '../../hooks/http';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [eneteredFilter, setEnteredFiler] = useState('');
  const inputRef = useRef();
  const {isLoading,clear,data,error,sendRequest} = useHttp();
  useEffect(()=> {
    const timer = setTimeout(()=>{
      if(eneteredFilter === inputRef.current.value){
        const query = eneteredFilter.length ===0 ?'': `?orderBy="title"&equalTo="${eneteredFilter}"`;
        sendRequest('https://react-hook-8e8ad.firebaseio.com/ingredients.json'+query, 'GET');
      }
    },500);
    //cleanup function, behave like component unmount
    return () => {
      clearTimeout(timer);
    };
  }, [eneteredFilter,inputRef, sendRequest]);

  useEffect(() => {
    if(!isLoading && !error && data) {
      const loadedIngredients =[];
      for(const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  } , [data,onLoadIngredients, error, isLoading]);
  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading ... </span>}
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
