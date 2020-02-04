import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients , setUserIngredients ] = useState([]);

  const addIngredientsHandler = ingredient => {
    fetch('https://react-hook-8e8ad.firebaseio.com/ingredients.json', {
      method  : 'POST',
      body : JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => {
      return response.json();
    }).then(responseBody => {
      console.log(responseBody);
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
