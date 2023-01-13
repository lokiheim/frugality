$(document).ready(function () {
  let mealIds = JSON.parse(localStorage.getItem('meal-ids'));
  let drinkInput = localStorage.getItem('drink-name');
  let suggestionId = localStorage.getItem('suggestion-id');

  // Random meal
  const mealNameEl = $('#randomMealName');
  const mealImgEl = $('#randomMealImg');
  const categoryEl = $('#category');
  const ingredientsEl = $('#ingredients');
  const methodEl = $('#info');
  const videoLinkEl = $('#videoLink');

  // Suggested meals
  const cardsEl = $('#cards');

  // Cocktail match
  const cocktailImgEl = $('#cocktailImg');
  const cocktailNameEl = $('#cocktailName');

  init();

  // Build the suggested meal cards
  function buildCard(img, title, text, url, id) {
    let colEl = $('<div>').addClass('col-md-4 col-sm-12 bg-white card-content');
    let cardEl = $('<div>').addClass('card').attr('id', id);
    let bodyEl = $('<div>').addClass('card-body');
    let imgEl = $('<img>').attr('src', img);
    let titleEl = $('<h5>').addClass('card-title mt-4');
    let titleLinkEl = $('<a>').attr('href', url).text(title);
    let textEl = $('<p>').addClass('card-text');
    let icoEl = $('<i>').addClass('fa fa-tag');
    let spanEl = $('<span>').addClass('ml-2').attr('id', 'category').text(text);
    textEl.append(icoEl, spanEl);
    titleEl.append(titleLinkEl);
    bodyEl.append(imgEl, titleEl, textEl);
    cardEl.append(bodyEl);
    colEl.append(cardEl);
    cardsEl.append(colEl);
  }

  // Get suggested meals by ID
  function getSuggestions(id) {
    let queryURL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id;
    $.ajax({
      url: queryURL,
      method: 'GET',
    }).then(function (response) {
      let data = response.meals[0];
      let dataUrl = '#';
      buildCard(data.strMealThumb, data.strMeal, data.strCategory, dataUrl, data.idMeal);
    });
  }

  // Display suggested meals
  function displaySuggestions() {
    for (let i = 0; i < mealIds.length; i++) {
      if (
        (!suggestionId && mealIds[i] !== mealIds[0]) ||
        (suggestionId && mealIds[i] !== suggestionId)
      ) {
        getSuggestions(mealIds[i]);
      }
    }
  }

  // Get and display the random meal recipe
  function getMeal() {
    let queryRecipeURL;
    if (suggestionId) {
      queryRecipeURL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + suggestionId;
    } else {
      queryRecipeURL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealIds[0];
    }

    $.ajax({
      url: queryRecipeURL,
      method: 'GET',
    }).then(function (response) {
      let chosenRecipe = response.meals[0]; // Selects the first array item which is the meal recipe

      // Display the meal name
      let recipeName = response.meals[0].strMeal;
      mealNameEl.text(recipeName);

      // Display the recipe instructions
      methodEl.html(chosenRecipe.strInstructions);

      // Displays the meal thumbnail/image
      let recipeIcon = chosenRecipe.strMealThumb;
      mealImgEl.attr('src', recipeIcon);

      // Display the meal category
      categoryEl.text(chosenRecipe.strCategory);

      // Displays the youtube video for the recipe if available
      let youtubeVid = chosenRecipe.strYoutube;
      if (youtubeVid !== '') {
        let youtubeEmbed = youtubeVid.split('watch?v=').join('embed/');
        videoLinkEl.attr('src', youtubeEmbed);
        $('#videoYou').css('display', 'block');
      }

      // Get ingredients
      let rawIngredients = $.map(Object.keys(chosenRecipe), function (val) {
        if (val.indexOf('strIngredient') != -1) {
          return chosenRecipe[val];
        }
      });
      let filteredIngredients = rawIngredients.filter(function (val) {
        return val !== '';
      });

      // Get quantities
      let rawQty = $.map(Object.keys(chosenRecipe), function (val) {
        if (val.indexOf('strMeasure') != -1) {
          return chosenRecipe[val];
        }
      });
      let filteredQty = rawQty.filter(function (val) {
        return val !== ' ';
      });

      // Display quantities and ingredients
      for (let i = 0; i < filteredQty.length, i < filteredIngredients.length; i++) {
        let qty = filteredQty[i];
        let ingredient = filteredIngredients[i];
        let ingredientEl = $('<p>')
          .addClass('mb-1')
          .text(qty + ' ' + ingredient);
        ingredientsEl.append(ingredientEl);
      }
    });
  }

  // Get the ID of a random drink based on the ingredient searched
  function getDrink() {
    let queryURL = 'https://thecocktaildb.com/api/json/v1/1/filter.php?i=' + drinkInput;
    $.ajax({
      url: queryURL,
      method: 'GET',
    }).then(function (response) {
      // Get random drink name
      let randomDrink = getRandom(response.drinks).slice(0, 1)[0];

      // Display the cocktail name
      let drinkName = randomDrink.strDrink;
      cocktailNameEl.text(drinkName);

      // Display the cocktail Image
      let drinkImg = randomDrink.strDrinkThumb;
      cocktailImgEl.attr('src', drinkImg);
    });
  }

  function getSuggestedMeal(name) {
    let queryURL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + name;

    $.ajax({
      url: queryURL,
      method: 'GET',
      success: function (response) {
        if (response.meals) {
          window.location.href = './results.html';
        }
      },
    }).then(function (response) {
      let suggestedMeal = response.meals[0].idMeal;
      localStorage.setItem('suggestion-id', suggestedMeal);
    });
  }

  function init() {
    getMeal();
    getDrink();
    displaySuggestions();
  }

  cardsEl.on('click', 'a', function (e) {
    e.preventDefault();

    let clickedId = $(e.target).closest('.card').attr('id');
    getSuggestedMeal(clickedId);
  });
});
