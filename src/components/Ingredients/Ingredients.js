import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  // USed at root level
  const [ userIngredients , setUserIngredients ] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Side effect, logic that effects your application
  //Acts like componentDidupdate
  // With empty array acts Like componentDidMount and run only once
  useEffect(() => {
    console.log('rendering', userIngredients);
  },[userIngredients]);

  //Usecall back stops re-render
  const filteredIngredientsHandler = useCallback(fileteredIngredients => {
    setUserIngredients(fileteredIngredients);
  },[])
  const addIngredientsHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hook-8e8ad.firebaseio.com/ingredients.json', {
      method  : 'POST',
      body : JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseBody => {
      setUserIngredients(prevIngredients => [...prevIngredients, {id: responseBody.name , ...ingredient}]);
    })
    .catch(err => err);
  }
  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hook-8e8ad.firebaseio.com/ingredients/${ingredientId}.json`, {
      method  : 'DELETE'
    })
    .then(response => {
      setIsLoading(false);
      setUserIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingredientId));
    })
    .catch(error => {
      //Executed in Sync, batched together
      setError(error.message);
      setIsLoading(false);
    })
  }
  const clearError = () => {
    //Executed in Sync, batched together
    setError(null);
    setIsLoading(false);
  }
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientsHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {/* Need to add list here! */}
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
