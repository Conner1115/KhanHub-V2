/****************************************
 * Import Ace Themes
 *****************************************/
var themes = [
  "textmate",
  "ambiance",
  "chaos",
  "chrome",
  "clouds",
  "clouds_midnight",
  "cobalt",
  "crimson_editor",
  "dawn",
  "dracula",
  "eclipse",
  "github",
  "gob",
  "gruvbox",
  "idle_fingers",
  "iplastic",
  "katzenmilch",
  "kr_theme",
  "kuroir",
  "merbivore",
  "merbivore_soft",
  "mono_industrial",
  "monokai",
  "nord_dark",
  "pastel_on_dark",
  "solarized_dark",
  "solarized_light",
  "sqlserver",
  "terminal",
  "textmate",
  "tomorrow",
  "tomorrow_night",
  "tomorrow_night_blue",
  "tomorrow_night_bright",
  "tomorrow_night_eighties",
  "twilight",
  "vibrant_ink",
  "xcode"
];
for (var theme in themes) {
  var Theme = document.createElement("script");
  Theme.src =
    "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/theme-" +
    themes[theme] +
    ".min.js";
  document.head.appendChild(Theme);
}
/****************************************
 * Global Variables
 *****************************************/
var currentProject = 0;
var currentTheme = "textmate";
var projectCodes = [];
var projectTitles = [];
var e = document.querySelector("#editor");
var editor = ace.edit(e);
var live_window;
var scenes = ["Home", "About", "Projects", "Guide", "Credits", "Editor"];
var transDir = 2;
var specialWord = "script";
var defaultWebpageContent = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>New webpage</title>
    </head>
    <body>

    </body>
</html>`;
var processingTemplate = `<!DOCTYPE html>
<html> 
  <head>
    <title>Processing.JS inside Webpages: Template</title> 
  </head>
  <body style="margin:0">
	<!--This draws the canvas on the webpage -->
    <canvas id="mycanvas"></canvas> 
  </body>
 
  <!-- Include the processing.js library -->
  <!-- See https://khanacademy.zendesk.com/hc/en-us/articles/202260404-What-parts-of-ProcessingJS-does-Khan-Academy-support- for differences -->
  <${"script"} src="https://cdn.jsdelivr.net/processing.js/1.4.8/processing.min.js"></${"script"}> 
  <${"script"}>
  var programCode = function(processingInstance) {
    with (processingInstance) {
      //size of the canvas.  If you want a fullscreen canvas, replace that with this: size(window.outerWidth,window.outerHeight)
      size(400, 400); 
      frameRate(30);
        
      // Paste code from Khan Academy here or start coding in PJS:
    
    
    
    }};

  // Get the canvas that ProcessingJS will use
  var canvas = document.getElementById("mycanvas"); 
  // Pass the function to ProcessingJS constructor
  var processingInstance = new Processing(canvas, programCode); 
  </${"script"}>
</html>`;
/****************************************
 * Helper Functions
 *****************************************/
var $ = (prop) => document.querySelector(prop);
var $$ = (prop) => document.querySelectorAll(prop);
var storeData = function (key, val, stringify) {
  if (typeof Storage !== "undefined") {
    if (!stringify) {
      localStorage.setItem(key, val);
    } else {
      localStorage.setItem(key, JSON.stringify(val));
    }
  } else {
    console.log("Sorry, your browser doesnt' support Local Storage");
  }
};
var getData = function (key, parse) {
  if (typeof Storage !== "undefined") {
    if (!parse) {
      return localStorage.getItem(key);
    } else {
      return JSON.parse(localStorage.getItem(key));
    }
  } else {
    console.log("Sorry, your browser doesnt' support Local Storage");
  }
};
var clearData = function () {
  localStorage.clear();
};
var animateElement = function (element, animation) {
  $(element).style.animation = animation;
  $(element).style.animationFillMode = "forwards";
};
/****************************************
 * Storage
 *****************************************/
if (getData("pr0j3ct-c0d3s")) {
  projectCodes = getData("pr0j3ct-c0d3s", true);
}
if (getData("pr0j3ct-t1tl3s")) {
  projectTitles = getData("pr0j3ct-t1tl3s", true);
}

/****************************************
 * Set up the Editor
 *****************************************/
editor.getSession().setMode("ace/mode/html");
editor.setOptions({
  maxLines: 20,
  minLines: 20
});
editor.setValue(processingTemplate);
$("#editor").style.fontSize = 15 + "px";
$("#result").srcdoc = editor.getValue();
var result = document.createElement("iframe");
result.style.width = "100%";
result.style.height = "100%";
result.style.border = "none";
result.sandbox =
  "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation";

$("#result").appendChild(result);
$("#choose-theme").addEventListener("change", () => {
  editor.setTheme("ace/theme/" + $("#choose-theme").value);
});

/****************************************
 * Event Functions
 *****************************************/
function live_preview() {
  live_window = window.open("", "_blank");
  live_window.document.open();
  live_window.document.write(result.srcdoc);
  live_window.document.close();
}
function updatePreview() {
  result.srcdoc = editor.getValue();
  if (live_window) {
    live_window.document.open();
    live_window.document.write(result.srcdoc);
    live_window.document.close();
  }
}
function dropCreator() {
  $("#wall").style.display = "block";
  $("#dropdown-create").style.display = "block";
  animateElement("#dropdown-create", "dropdown 1s 1");
}
function hideCreator() {
  animateElement("#dropdown-create", "slideup 1s 1");
  setTimeout(() => {
    $("#wall").style.display = "none";
    $("#dropdown-create").style.display = "none";
  }, 500);
}
function dropDel() {
  $("#wall").style.display = "block";
  $("#dropdown-delete").style.display = "block";
  animateElement("#dropdown-delete", "dropdown 1s 1");
}
function hideDel() {
  animateElement("#dropdown-delete", "slideup 1s 1");
  setTimeout(() => {
    $("#wall").style.display = "none";
    $("#dropdown-delete").style.display = "none";
  }, 500);
}
function projOnClick(num) {
  var buttonIndex = $$(".project-" + num);
  for (var i = 0; i < buttonIndex.length; i++) {
    buttonIndex[i].addEventListener("click", function () {
      $("#program-title").innerText = projectTitles[num];
      editor.setValue(projectCodes[num]);
      currentProject = num;
      updatePreview();
      showPage("Editor");
    });
  }
}
function updateProjectList() {
  if(projectTitles.length > 0){
    $("#project-list").innerHTML = "";
  for (var i = 0; i < projectTitles.length; i++) {
    $("#project-list").innerHTML +=
      "<div class='project project-" + i + "'>" + projectTitles[i] + "</div>";
    projOnClick(i);
  }
  }else{
    $("#project-list").innerHTML = "<p>You don't have any projects yet.  Howabout creating one?</p>";
  }
}
function pushProject() {
  if ($("#new-project-name").value !== "") {
    var edVal;
    if ($("#project-type").value === "webpage") {
      edVal = defaultWebpageContent;
    } else {
      edVal = processingTemplate;
    }
    if(projectCodes.length < 5){
    projectCodes.push(edVal);
    projectTitles.push($("#new-project-name").value);
    storeData("pr0j3ct-c0d3s", projectCodes, true);
    storeData("pr0j3ct-t1tl3s", projectTitles, true);
    hideCreator();
    }else{
      alert("Sorry, but you can't have more than five projects.  Read the User Guide for more info.")
    }
  } else {
    alert("Please name your project");
  }
  updateProjectList();
}
function spliceProject() {
  if ($("#del-project-name").value === "") {
    alert("Please enter a project name.  This field is required");
  } else if ($("#del-project-name").value !== "") {
    var ind = projectTitles.indexOf($("#del-project-name").value);
    if (ind !== -1) {
      projectTitles.splice(ind, 1);
      projectCodes.splice(ind, 1);
      storeData("pr0j3ct-c0d3s", projectCodes, true);
      storeData("pr0j3ct-t1tl3s", projectTitles, true);
      updateProjectList();
      hideDel();
      $("#del-project-name").value = "";
    } else {
      alert(
        "That project doesn't exist.  Please note that this field is Case and Punctuation Sensitive."
      );
    }
  }
}
function saveProgram() {
  if (!$("#save-button").disabled) {
    $("#save-button").innerHTML = "Saving...";
    $("#save-button").disabled = true;
    setTimeout(() => {
      $("#save-button").innerHTML = "Saved!";
      $("#save-button").disabled = true;
    }, 1500);
    setTimeout(() => {
      $("#save-button").innerHTML = "Save";
      $("#save-button").disabled = false;
    }, 3000);
  }
  projectCodes[currentProject] = editor.getValue();
  storeData("pr0j3ct-c0d3s", projectCodes, true);
}
function deploy_site() {
  $("#cwall").style.display = "block";
  $("#dropdown-deploy").style.display = "block";
  animateElement("#dropdown-deploy", "dropdown 1s 1");
  var parseVal = projectCodes[currentProject].replace(/script/g, "${'script'}");
  $("#deployment-clipboard").value =
    `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>New webpage</title>
    </head>
    <body style="position:absolute;width:100%;height:100%;margin:0;">
    <h1 style="text-align:center" onclick="openLive()">Please Click the Screen</h1>
<${"script"} type="application/javascript">
    var live_window;
    function openLive(){
        live_window = window.open("","_blank");
        live_window.document.open();
        live_window.document.write(` +
    "`" +
    parseVal +
    "`" +
    `);
        live_window.document.close();
    }
</${"script"}>
    </body>
</html>`;
}
function hideDeploy() {
  animateElement("#dropdown-deploy", "slideup 1s 1");
  setTimeout(() => {
    $("#cwall").style.display = "none";
    $("#dropdown-deploy").style.display = "none";
  }, 500);
}
function copyToClipboard() {
  var copyText = $("#deployment-clipboard");
  copyText.select();
  copyText.setSelectionRange(0, 999999999999999999);
  document.execCommand("copy");
  $("#copy-button").innerHTML = "Copied to clipboard!";
  $("#copy-button").disabled = true;
  setTimeout(() => {
    $("#copy-button").innerHTML = "Copy to Clipboard";
    $("#copy-button").disabled = false;
  }, 1500);
}

(function setup() {
  let pages = document.getElementsByClassName("page");
  for (var i = 0; i < pages.length; i++) {
    pages[i].style.minHeight = window.innerHeight - 70;
  }
  $("#wall").style.display = "none";
  $("#dropdown-create").style.display = "none";
  $("#dropdown-delete").style.display = "none";
  updatePreview();
  updateProjectList();
})();

/****************************************
 * Scene Management
 *****************************************/
function showPage(page) {
  window.scrollTo(0, 0);
  let pages = document.getElementsByClassName("page");
  for (var i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
  }
  $("#transition-cover").style.display = "block";
  $("#transition-cover").style.animation = "switchTrans " + transDir + "s 1";
  $("#transition-cover2").style.display = "block";
  $("#transition-cover2").style.animation = "switchTrans1 " + transDir + "s 1";
  $("#transition-cover3").style.display = "block";
  $("#transition-cover3").style.animation = "switchTrans2 " + transDir + "s 1";
  $("#transition-cover4").style.display = "block";
  $("#transition-cover4").style.animation = "switchTrans3 " + transDir + "s 1";
  setTimeout(function () {
    $("#" + page).style.display = "block";
    editor.setValue(projectCodes[currentProject]);
  }, transDir * 500);
  setTimeout(function () {
    $("#transition-cover").style.animation = "none";
    $("#transition-cover").style.display = "none";
    $("#transition-cover2").style.animation = "none";
    $("#transition-cover2").style.display = "none";
    $("#transition-cover3").style.display = "none";
    $("#transition-cover3").style.animation = "none";
    $("#transition-cover4").style.display = "none";
    $("#transition-cover4").style.animation = "none";
  }, transDir * 1000);
}
showPage("Home");
function showOnClick(num) {
  var buttonIndex = $$("." + scenes[num] + "-button");
  for (var i = 0; i < buttonIndex.length; i++) {
    buttonIndex[i].addEventListener("click", function () {
      animateElement("#navigation-dropdown", "closeNav 1s 1");
      showPage(scenes[num]);
    });
  }
}
for (var i = 0; i < scenes.length; i++) {
  showOnClick(i);
}
for (var i = 0; i < projectTitles.length; i++) {
  projOnClick(i);
}
