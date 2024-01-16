//If this script is the LAST line before </body> then there is no need in DOMContentLoaded
//document.addEventListener('DOMContentLoaded', () => {

const openMenu  = () => document.getElementById("navMenu").classList.add("side-menu_expanded");
const closeMenu = () => document.getElementById("navMenu").classList.remove("side-menu_expanded");

const btnMenuOpen = document.getElementById("btnMenuOpen");
const btnMenuClose = document.getElementById("btnMenuClose");

btnMenuOpen.addEventListener("click", openMenu);
btnMenuClose.addEventListener("click", closeMenu);

document.addEventListener("click", e => { if (!btnMenuOpen.contains(e.target)) closeMenu(); });


//});
