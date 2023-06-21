import * as model from './model'
import recipeView from './views/recipeView'
import searchView from './views/searchView'
import resultsView from './views/resultsView'

import 'core-js/stable'

// https://forkify-api.herokuapp.com/v2

if (module.hot) {
  module.hot.accept()
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)
    if (!id) return
    recipeView.renderSpinner()

    await model.loadRecipe(id)

    recipeView.render(model.state.recipe)
  } catch (error) {
    recipeView.renderError()
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()
    const query = searchView.getQuery()
    if (!query) return

    await model.loadSearchResults(query)
    resultsView.render(model.state.search.results)
  } catch (error) {
    console.log(error)
  }
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes)
  searchView.addHandlerSearch(controlSearchResults)
}

init()
