/*
 * Handles mobile nav
 */

function toggleMobileNavState() {
  const body = document.querySelector("body");
  body.classList.toggle("nav--active");
}

/*
 * Initializes burger functionality
 */

function initBurger() {
  const burger = document.querySelector(".burger");
  burger.addEventListener("click", toggleMobileNavState);
}
function initSubcategory() {
	
	if(window.location.pathname.indexOf('subcategories') > -1){
		var query = searchParam('category');
		
		var category = document.querySelector("#category__link");
		category.innerHTML = query[0].toUpperCase() + query.slice(1);
		category.href = "/categories/"+query;
	}
}
function searchParam(key) {
  return new URLSearchParams(location.search).get(key);
};
initBurger();
initSubcategory();
