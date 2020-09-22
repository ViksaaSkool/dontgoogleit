const API_KEY = "J1TXARGYWND1"
const LIMIT = 50
const BASE_URL = "https://api.tenor.com/v1/search?q="
const PARAM_LIMIT = "&limit="
const PARAM_KEY = "&key="
const CAT_LIST = ["cat", "kitty", "kitten", "cats"]
const DESCRIPTOR_LIST = ["funny", "fun", "stupid", "cute", "confused", "fail"]
const GIFS_LIST = "gifs"

var gifs = localStorage.getItem(GIFS_LIST);
var gifs_list = null;
var gifs_loading = false;

/* init methods */
window.onload = function() {
  grab_data(onResponseReady);
  setThemeSwitcher()
};

/* Util methods */
function generate_search_url() {
  return BASE_URL + generate_random_search_term() + PARAM_KEY + API_KEY + PARAM_LIMIT + LIMIT;
}

function generate_random_search_term() {
  return DESCRIPTOR_LIST[generate_random_index(DESCRIPTOR_LIST.length)] + " " + CAT_LIST[generate_random_index(CAT_LIST.length)];
}

function generate_random_index(list_lenght) {
  return Math.floor((Math.random() * list_lenght));
}


/* Gif loadging related */
function grab_data(callback) {
  console.log(hasGifsStored())
  if (hasGifsStored()) {
    load_gif()
    return;
  }

  var gif_url = generate_search_url();
  console.log(gif_url)
  var xmlHttp = new XMLHttpRequest();


  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp.responseText);
      gifs_loading = false;
    }
  }
  xmlHttp.open("GET", gif_url, true);
  xmlHttp.send(null);
  gifs_loading = true;

}

function hasGifsStored() {
  return gifs != null && JSON.parse(gifs).length > 0 && typeof gifs !== 'undefined'
}

function onResponseReady(response_text) {
  var response_objects = JSON.parse(response_text);
  var cat_gifs = [];

  response_objects["results"].forEach((item, i) => {
    cat_gifs[i] = item["media"][0]["tinygif"]["url"]
  });

  localStorage.setItem(GIFS_LIST, JSON.stringify(cat_gifs));
  gifs = localStorage.getItem(GIFS_LIST)
  gifs_list = JSON.parse(gifs);

  console.log(JSON.parse(gifs)[45])

}

function load_gif() {
  if (gifs_loading) {
    return
  }

  if (gifs_list == null) {
    gifs_list = JSON.parse(gifs);
  }

  //document.getElementById("cat_gif").src = gifs_list[0]
  document.getElementById("cat_gif").style.backgroundImage = "url(" + gifs_list[0] + ")"
  gifs_list.splice(0, 1)
  console.log(gifs_list.length)
  if (gifs_list.length == 0) {
    gifs = null
    localStorage.setItem(GIFS_LIST, gifs);
    grab_data(onResponseReady);
  }
}

/* Theme related */
function setThemeSwitcher() {
  document.getElementById('toggle').addEventListener('input', e => {
    document.body.classList.toggle("dark-mode");
  });
}