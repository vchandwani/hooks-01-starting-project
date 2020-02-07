import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredient, action) => {
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredient , action.ingredient];
    case 'DELETE':
      return  currentIngredient.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Something wrong!');
  }
}

const Ingredients = () => {
  const [userIngredients,dispatch] = useReducer(ingredientReducer,[]);
  const {isLoading, error, data, sendRequest, reqExtra,reqIdentifier, clear} = useHttp();
  // USed at root level
  // const [ userIngredients , setUserIngredients ] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  //Side effect, logic that effects your application
  //Acts like componentDidupdate
  // With empty array acts Like componentDidMount and run only once
  useEffect(() => {
    if(reqIdentifier === 'REMOVE_INGREDIENT' && !error && !isLoading){
      dispatch({type:'DELETE',id: reqExtra});
    } else if(reqIdentifier === 'ADD_INGREDIENT' && !error && !isLoading) {
      dispatch({type:'ADD',ingredient:{id: data.name , ...reqExtra}});
    }
  },[data,reqExtra,reqIdentifier,isLoading,error]);

  //Usecall back stops re-render
  const filteredIngredientsHandler = useCallback(fileteredIngredients => {
    dispatch({type:'SET',ingredients:fileteredIngredients});
  },[])
  const addIngredientsHandler = useCallback(ingredient => {
    sendRequest(`https://react-hook-8e8ad.firebaseio.com/ingredients.json`,'POST',JSON.stringify(ingredient),ingredient,'ADD_INGREDIENT');
    // dispatchHttp({type:'SEND'});
    // fetch('https://react-hook-8e8ad.firebaseio.com/ingredients.json', {
    //   method  : 'POST',
    //   body : JSON.stringify(ingredient),
    //   headers: {'Content-Type': 'application/json'}
    // })
    // .then(response => {
    //   dispatchHttp({type:'RESPONSE'});
    //   return response.json();
    // }).then(responseBody => {
    //   dispatch({type:'ADD',ingredient:{id: responseBody.name , ...ingredient}});
    // })
    // .catch(err => err);
  }, []);
  const removeIngredientHandler = useCallback(ingredientId => {
    // dispatchHttp({type:'RESPONSE'});
    sendRequest(`https://react-hook-8e8ad.firebaseio.com/ingredients/${ingredientId}.json`, 'DELETE',null,ingredientId,'REMOVE_INGREDIENT');
  },[]);
  
  const ingredientList = useMemo(() => {
    return (<IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />)},
    [userIngredients,removeIngredientHandler]
  );
  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientsHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {/* Need to add list here! */}
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
