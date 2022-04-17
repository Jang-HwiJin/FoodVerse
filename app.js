
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const https = require("https");

const app = express();
app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

let recipeTitle = "";
let summary = "";
let recipeId = "";
let recipeImg= "";
let recipeInstructions = "";

var ingredientsLength ="";

var ingredientsList = [];



app.get("/", function(req, res) {
  res.render("home");
});

app.post("/", function(req, res) {
  const recipeTags = req.body.recipeTag;
  const apiKey = "536d3fe9bf7d431890d91be694eebd34";
  const nbrRecipe = 1;
  let url = "https://api.spoonacular.com/recipes/random?apiKey=" + apiKey + "&number=" + nbrRecipe + "&tags=" + recipeTags;

  https.get(url, function(response){
    console.log(response.statusCode); //Write the status code to console log to see if it was successful

    let chunks = "";
    response.on("data", function(data){
      chunks = chunks + data;
      });
    response.on("end", function(){
      recipeData = JSON.parse(chunks);
      recipeTitle = recipeData.recipes[0].title;
      summary = recipeData.recipes[0].summary;
      recipeId = recipeData.recipes[0].id;
      recipeImg = recipeData.recipes[0].image;
      recipeInstructions = recipeData.recipes[0].instructions;

      ingredientsLength = recipeData.recipes[0].extendedIngredients.length;

      for(var i = 0; i < ingredientsLength; i++) {
        ingredientsList.push(" " + recipeData.recipes[0].extendedIngredients[i].name);
      }
    });
    res.redirect("/recipe");
  });
});

app.get("/recipe", function(req, res) {
  res.render("recipe", {
    recipeTitle: recipeTitle,
    summary: summary,
    recipeId: recipeId,
    recipeImg: recipeImg,
    ingredientsList: ingredientsList,
    recipeInstructions: recipeInstructions
  });
  ingredientsList = [];
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});

//API Key
//536d3fe9bf7d431890d91be694eebd34
