import View from './View'
import previewView from './previewView'
import icons from 'url:../../img/icons.svg'

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list')
  _errorMessage = 'No bookmarks yet. Find a nice recipe!'
  _message = ''

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join('')
  }
}

export default new BookmarksView()
