import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

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
const httpReducer = (httpState, action) => {
  switch(action.type){
    case 'SEND':
      return {error:null,loading:true};
    case 'RESPONSE':
      return {...httpState,loading:false};
    case 'ERROR':
      return {error:action.errorMessage,loading:false};
    case 'CLEAR':
      return {...httpState,error:null};
    default:
      throw new Error('Something wrong!');
  }
}
const Ingredients = () => {
  const [userIngredients,dispatch] = useReducer(ingredientReducer,[]);
  const [httpState,dispatchHttp] = useReducer(httpReducer,{loading:false,error:null});

  // USed at root level
  // const [ userIngredients , setUserIngredients ] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  //Side effect, logic that effects your application
  //Acts like componentDidupdate
  // With empty array acts Like componentDidMount and run only once
  useEffect(() => {
    console.log('rendering', userIngredients);
  },[userIngredients]);

  //Usecall back stops re-render
  const filteredIngredientsHandler = useCallback(fileteredIngredients => {
    dispatch({type:'SET',ingredients:fileteredIngredients});
  },[])
  const addIngredientsHandler = ingredient => {
    dispatchHttp({type:'SEND'});
    fetch('https://react-hook-8e8ad.firebaseio.com/ingredients.json', {
      method  : 'POST',
      body : JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => {
      dispatchHttp({type:'RESPONSE'});
      return response.json();
    }).then(responseBody => {
      dispatch({type:'ADD',ingredient:{id: responseBody.name , ...ingredient}});
    })
    .catch(err => err);
  }
  const removeIngredientHandler = ingredientId => {
    dispatchHttp({type:'RESPONSE'});
    fetch(`https://react-hook-8e8ad.firebaseio.com/ingredients/${ingredientId}.json`, {
      method  : 'DELETE'
    })
    .then(response => {
      dispatchHttp({type:'RESPONSE'});
      dispatch({type:'DELETE',id:ingredientId});
    })
    .catch(error => {
      //Executed in Sync, batched together
      dispatchHttp({type:'ERROR', errorMessage:error.message});

    })
  }
  const clearError = () => {
    //Executed in Sync, batched together
    dispatchHttp({type:'CLEAR'});

  }
  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={httpState}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientsHandler} loading={httpState.loading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {/* Need to add list here! */}
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
