$(document).ready(function () {
  let trendingId = localStorage.getItem('trending-id');

  // Trending mel recipe
  const mealNameEl = $('#trendingName');
  const mealImgEl = $('#trendingImg');
  const categoryEl = $('#trendingCategory');
  const ingredientsEl = $('#trendingIngredients');
  const methodEl = $('#trendingInfo');
  const videoLinkEl = $('#trendingVideoLink');

  // Get and display the trending meal recipe
  function getMeal() {
    let queryRecipeURL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + trendingId;

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
        $('#trendingVideoYou').css('display', 'block');
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

  getMeal();
});
