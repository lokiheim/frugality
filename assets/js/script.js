//load code when js doc is fully ready
$(document).ready(function () {
  // Inspire me
  const mealEl = $('#mealIngredient');
  const cocktailEl = $('#cocktailIngredient');
  const searchBtnEl = $('#searchBtn');

  // Trending recipe
  const randomInspo = $('#meal-text');
  const inspoImg = $('#inspo-img');
  const inspoCategory = $('#trendingCategory');
  const viewTrending = $('#viewTrending');

  // Declare the variable mealIds and initialize it with an empty array
  let mealIds = [];

  getMealInspo();

  // Clear the localStorage if meal IDs exist
  function removeMealIds() {
    let mealIds = JSON.parse(localStorage.getItem('meal-ids'));
    let drinkId = localStorage.getItem('drink-id');
    let suggestionId = localStorage.getItem('suggestion-id');

    if (mealIds || drinkId || suggestionId) {
      localStorage.clear();
    }
  }

  // Meal of The Day name and image.
  function getMealInspo() {
    let queryURL = 'https://www.themealdb.com/api/json/v1/1/random.php';

    $.ajax({
      url: queryURL,
      method: 'GET',
    }).then(function (response) {
      let randomMealInspo = response.meals[0];
      let mealInspoId = randomMealInspo.idMeal;
      let randomImg = randomMealInspo.strMealThumb;
      let mealInspoName = randomMealInspo.strMeal;
      let mealInspoCategory = randomMealInspo.strCategory;

      // Display the meal name, category and image on the home page
      randomInspo.text(mealInspoName);
      inspoImg.attr('src', randomImg);
      inspoCategory.text(mealInspoCategory);

      // Save the searched drink ingredient to the localStorage
      localStorage.setItem('trending-id', mealInspoId);
    });
  }

  // Get 4 random meal IDs based on the ingredient searched
  function getMealIds(name) {
    let queryURL = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + name;

    $.ajax({
      url: queryURL,
      method: 'GET',
      success: function (response) {
        if (response.meals) {
          window.location.href = './results.html';
        }
      },
    }).then(function (response) {
      // Choose 4 random meals from the API response
      let randomMeals = getRandom(response.meals).slice(0, 4);

      for (let i = 0; i < randomMeals.length; i++) {
        // Save the random meal's Ids to the localStorage
        let mealId = randomMeals[i].idMeal;
        mealIds.push(mealId);
        localStorage.setItem('meal-ids', JSON.stringify(mealIds));
      }
    });
  }

  // On submit display one random meal
  searchBtnEl.on('click', function (e) {
    e.preventDefault();

    removeMealIds();

    let mealInput = mealEl.val().trim().split(' ').join('_');
    let drinkInput = cocktailEl.val().trim().split(' ').join('_');

    if (mealInput === '' || drinkInput === '') {
      $('.search-alert').css('display', 'block');
      return;
    }

    // Calls the getMealIds function and takes the input 'foodInput' (replaces the input 'name' with mealInput)
    getMealIds(mealInput);

    // Save the searched drink ingredient to the localStorage
    localStorage.setItem('drink-name', drinkInput);
  });

  viewTrending.on('click', function (e) {
    e.preventDefault();

    window.location.href = './view-trending.html';
  });
});
