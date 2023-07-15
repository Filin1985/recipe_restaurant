import * as model from './model'
import {MODAL_CLOSE_SEC} from './config'
import recipeView from './views/recipeView'
import searchView from './views/searchView'
import resultsView from './views/resultsView'
import bookmarksView from './views/bookmarksView'
import paginationView from './views/paginationView'
import addRecipeView from './views/addRecipeView'

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

    resultsView.update(model.getSearchResultsPage())

    await model.loadRecipe(id)

    recipeView.render(model.state.recipe)
    bookmarksView.update(model.state.bookmarks)
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
    resultsView.render(model.getSearchResultsPage(3))

    paginationView.render(model.state.search)
  } catch (error) {
    console.log(error)
  }
}

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage))
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  model.updateServings(newServings)

  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  recipeView.update(model.state.recipe)
  console.log(model.state.bookmarks)
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner()

    await model.uploadRecipe(newRecipe)

    recipeView.render(model.state.recipe)

    addRecipeView.renderMessage()

    bookmarksView.render(model.state.bookmarks)

    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (error) {
    console.error(error)
    addRecipeView.renderError(error.message)
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()
