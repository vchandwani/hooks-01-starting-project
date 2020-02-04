import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  // USed at root level
  const [ userIngredients , setUserIngredients ] = useState([]);

  //Side effect, logic that effects your application
  //Acts like componentDidupdate
  useEffect(() => {
    fetch('https://react-hook-8e8ad.firebaseio.com/ingredients.json')
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
      setUserIngredients(loadedIngredients);
    });
  },[]);
  // With empty array acts Like componentDidMount and run only once

  const addIngredientsHandler = ingredient => {
    fetch('https://react-hook-8e8ad.firebaseio.com/ingredients.json', {
      method  : 'POST',
      body : JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => {
      return response.json();
    }).then(responseBody => {
      setUserIngredients(prevIngredients => [...prevIngredients, {id: responseBody.name , ...ingredient}]);
    })
    .catch(err => err);
  }
  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingredientId));
  }
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientsHandler}/>

      <section>
        <Search />
        {/* Need to add list here! */}
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
