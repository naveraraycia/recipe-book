// ES6

// Recipe Class
class Recipe{
  constructor(ingredients, directions, serving, cookingTime, recipeName){
    this.recipeName = recipeName
    this.ingredients = ingredients
    this.directions = directions
    this.serving = serving
    this.cookingTime = cookingTime
  }
}

// UI Class
class UI{
  addRecipeToList(recipe){
    const collapsibleList = document.getElementById('recipe-list')
    const li = document.createElement('li')
  
    li.innerHTML = `
    <div class="collapsible-header">
    <span>${recipe.recipeName}</span>
    <div>
      <i class="fa-solid fa-rectangle-xmark red-text text-accent-4"></i>
    </div>
  </div>

  <div class="collapsible-body">
          <div class="collapse-headings">
            <h4>Ingredients</h4>
            <h4>Quantity</h4>
          </div>

          <div class="line"></div>

          ${recipe.ingredients.map(function(ingredientItem){
            return `
            <div class="ingredient-item">
            <h5 class="ingredient-val">${ingredientItem[0]}</h5>
            <h5 class="quantity-val">${ingredientItem[1]}</h5>
          </div>`
          }).join('')}


          <div class="line second"></div>

          <div class="collapsible-directions">
            <h4>Directions</h4>

            <ol class="directions-collapse-list">
            ${recipe.directions.map(function(directionItem){
              return `<li>${directionItem}</li>`
            }).join('')}
              
            </ol>
          </div>

          <div class="row cook-details">
            <div>
              <h4 class="orange-text text-darken-3">Number of Servings: <span>${recipe.serving}</span></h4>
              <h4 class="orange-text text-darken-3">Cooking Time: <span>${recipe.cookingTime}</span></h4>
            </div>
          </div>
        </div>
    `

    collapsibleList.appendChild(li)
  }

  clearFields(){
  document.querySelectorAll('.ingredient').forEach(function(item){
    item.value = ''
  })
  document.querySelectorAll('.quantity').forEach(function(item){
    item.value = ''
  })
  document.querySelectorAll('.direction').forEach(function(item){
    item.value = ''
  })


  document.querySelector('#servings').value = ''
  document.querySelector('#cook-time').value = ''
  document.getElementById('recipe-name').value = ''


  document.querySelectorAll('.ingredient').forEach(function(item){
    if(document.querySelectorAll('.ingredient').length > 1){
      item.parentElement.parentElement.parentElement.parentElement.remove()
    }
  })

  document.querySelectorAll('.direction').forEach(function(item){
    if(document.querySelectorAll('.direction').length > 1){
      item.parentElement.parentElement.parentElement.remove()
    }
  })
  
  }

  showAlert(message, className){
    const parent = document.getElementById('form')
    const sibling = parent.firstElementChild

    const alert = document.createElement('div')
    alert.className = 'alert'
    alert.id = 'alert'
    alert.innerHTML = `
    <div class="card z-depth-0 ${className}">
      <div class="card-content white-text">
        ${message}
      </div>
    </div>
    `

    parent.insertBefore(alert, sibling)

    setTimeout(function(){
      document.getElementById('alert').remove()
    }, 3000)
  }
 
}

// Local Storage Class
class Storage{
  static getStorage() {
    let arr = []
    if(localStorage.getItem('recipe') === null){
      arr = []
    } else {
      arr = JSON.parse(localStorage.getItem('recipe'))
    }

    return arr
  }

  static addToStorage(recipe){
    const storageContent = Storage.getStorage()
    storageContent.push(recipe)
    localStorage.setItem('recipe', JSON.stringify(storageContent))
  }

  static displayRecipes(){
    const storageContent = Storage.getStorage()

    storageContent.forEach(function(recipeItem){
      const ui = new UI()
      ui.addRecipeToList(recipeItem)
    })
  }

  static deleteRecipe(recipe){
    const storageContent = Storage.getStorage()

    storageContent.forEach(function(storageItem, index){
      if(storageItem.recipeName === recipe){
        storageContent.splice(index, 1)
      }
    })

    localStorage.setItem('recipe', JSON.stringify(storageContent))
  }
}

// Event Listeners
// Load Content DOM event listener
document.addEventListener('DOMContentLoaded', Storage.displayRecipes)

// Form Submit event listener
document.getElementById('form').addEventListener('submit', function(e){
  e.preventDefault()
  if(document.querySelector('.ingredient-col').children[1].classList.contains('group-input') && document.querySelector('#direction-list').firstElementChild !== null){
    const ingredients = document.querySelectorAll('.ingredient')
    const quantity = document.querySelectorAll('.quantity')
    const directions = document.querySelectorAll('.direction')
    const servingNumber = document.querySelector('#servings').value
    const cookingTime = document.querySelector('#cook-time').value
    const recipeName = document.getElementById('recipe-name').value
  
    let directionArray = []
    let ingredientArray = []
  
    ingredients.forEach(function(ingredient, index){
      let arr = [ingredient.value, quantity[index].value]
      ingredientArray.push(arr)
  
    })
  
    directions.forEach(function(direction){
      directionArray.push(direction.value)
    })
  

    const recipe = new Recipe(ingredientArray, directionArray, servingNumber, cookingTime, recipeName)
  
    console.log(recipe)
  
    const ui = new UI()
  
    ui.addRecipeToList(recipe)
  
    ui.clearFields()
  
    Storage.addToStorage(recipe)
  
    const success = 'green darken-1'
  
    ui.showAlert('Recipe Saved!', success)
     
  } else {
    const ui = new UI()
    ui.showAlert('Please add ingredients and directions!', 'red')
  }
})

// Delete ingredient event listener
document.querySelector('.ingredient-col').addEventListener('click', function(e){
  if(e.target.classList.contains('fa-circle-xmark')){
    e.target.parentElement.parentElement.remove()
  }
})

// Delete Direction event listener
document.querySelector('.direction-col').addEventListener('click', function(e){
  if(e.target.classList.contains('fa-circle-xmark')){
    e.target.parentElement.parentElement.parentElement.remove()
  }
})

// Add Ingredient event listener
document.querySelector('.ingredient-col').addEventListener('click', function(e){
  const parent = document.querySelector('.ingredient-col')
  const sibling = document.querySelector('.ingredient-btn')

  if(e.target.classList.contains('ingredient-btn')){
    const ingredientRow = document.createElement('div')
    ingredientRow.className = 'row group-input'
    ingredientRow.innerHTML = `
    
      <div class="col m10 s10">
        <div class="row">
          <div class="input-field col m8 s8">
            <input class="ingredient" type="text" placeholder="Item" required>
          </div>
          <div class="col m4 s4">
            <div class="input-field">
              <input class="quantity" type="text" placeholder="Quantity" required>
            </div>
          </div>
        </div>      
      </div>
              
      <div class="col m2 s2 right-align">
        <i class="fa-solid fa-circle-xmark red-text text-accent-4"></i>    
      </div>
    
    `
    parent.insertBefore(ingredientRow,sibling)
  }
})

// Add Directions event listener
document.querySelector('.direction-col').addEventListener('click', function(e){
  const parent = document.getElementById('direction-list')
  if(e.target.classList.contains('direction-btn')){
    const directionListItem = document.createElement('li')
    const directionRowDiv = document.createElement('div')
    directionRowDiv.className = 'list-div row'
    directionRowDiv.innerHTML = `
      <div class="input-field col m10">
        <textarea placeholder="Step" class="materialize-textarea direction" required></textarea>
      </div>    
      <div class="col m2">
        <i class="fa-solid fa-circle-xmark red-text text-accent-4"></i>  
      </div>
    `
    directionListItem.appendChild(directionRowDiv)
    parent.appendChild(directionListItem)

  }
})

// Delete Recipe List Item event Listener
document.getElementById('recipe-list').addEventListener('click', function(e){
  if(e.target.classList.contains('fa-rectangle-xmark')){
    if(confirm('Are you sure you want to delete this recipe?')){
      e.target.parentElement.parentElement.parentElement.remove()
      Storage.deleteRecipe(e.target.parentElement.previousElementSibling.textContent)
    }
  }
})

