import * as model from './model'
import recipeView from './views/recipeView'

import 'core-js/stable'

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)
    if (!id) return
    recipeView.renderSpinner()

    await model.loadRecipe(id)

    recipeView.render(model.state.recipe)
  } catch (error) {
    console.log(error)
  }
}

;['hashchange', 'load'].forEach((ev) =>
  window.addEventListener(ev, controlRecipes)
)
