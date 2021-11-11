// NAVBAR UNCOLLAPSE WHEN BLURRED ================================================================================================================================================================================================

// Create a IIFE for 'uncollapse' the menu in XS mode when we click out of it ('blur' event)
// document.addEventListener(
//     "DOMContentLoaded", 
//     function (event) {
//         document.querySelector("#navbarToggle").addEventListener(
//             "blur", 
//             function (event) {
//                 var screenWidth = window.innerWidth;
//                 if (screenWidth < 768) {
//                     $("#collapsable-nav").collapse('hide');
//                 }
//             }
//         )
//     }
// );

// SPA IMPLEMENTATION ============================================================================================================================================================================================================

// Create a IIFE for implementing the SPA (Single-Page-Application)
(function (global) {

    // Define an object for the restaurant
    var dc = {};
    
    // Define a function for inserting HTML strings inside element identified by 'selector'
    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    // Define a function to insert the value of a "propValue" into "{{propName}}" in a string
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue); // 'g' means that we wanna replace it everywhere in the string
        return string;
    };

    // Define a function to display a GIF image inside element identified by 'selector'
    // Tip: some loading icons can be taken or even generated from 'ajaxload.info' website for free
    var showLoading = function (selector) {
        var html = "<div class='text-center'>";
        html += "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    // Define a function to add the Bootstrap "active" class to the element
    var switchToActive = function (selector) {

        // Remove the 'active' class
        var classes = document.querySelector(selector).className; 
        classes = classes.replace(new RegExp("active", "g"), ""); // 'g' means globally, so everywhere
        document.querySelector(selector).className = classes;

        // Add 'active' class
        classes = document.querySelector(selector).className;
        if (classes.indexOf("active") == -1) { // '-1' means that the string 'active' cannot be found anywhere
            classes += " active"; // remember the space before the word 'active'
            document.querySelector(selector).className = classes;
        };
    };

    // Define a function to remove the Bootstrap "active" class from an array of elements
    var switchToUnactive = function (selectorList) {
        for (var i=0; i < selectorList.length; i++) {
            var classes = document.querySelector(selectorList[i]).className;
            classes = classes.replace(new RegExp("active", "g"), ""); // 'g' means globally, so everywhere
            document.querySelector(selectorList[i]).className = classes;
        }
    };

    // ################################### HOME PAGE MANIPULATIONS #############################################

    // Define the path to HTML page to be inserted into the 'main-content' index page
    var homeHtml = "snippets/home-snippet.html";

    // Define a function to load the 'home page' content in the 'main-content' of the page
    // This function will be triggered automatically when DOM content is completely loaded
    document.addEventListener(
        "DOMContentLoaded", 
        function (event) {
            showLoading("#main");
            $ajaxUtils.sendGetRequest(
                homeHtml, 
                function (responseText) {
                    document.querySelector("#main").innerHTML = responseText;
                },
            false); // the element will not be converted from a JSON string
    });


    // ################################### CATEGORIES PAGE MANIPULATIONS #############################################

    // Define the URL to JSON from where to pull the data
    var categoriesJson = "categories.json";

    // Define the paths to HTML pages to be inserted into the 'main' selector
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";    

    // Define a function to build up the categories HTML string to be inserted in the 'main' selector
    function buildCategoriesHtml(categories, categoriesTitleHtml, categoryHtml) {

        // Create the final HTML string from the 'category-title-snippet.html' and a section opening tag 
        var categoriesHtml = categoriesTitleHtml;
        categoriesHtml += "<section class='row'>";  // 'row' is a Bootstrap class to specify that we will be dealing with 1/12 width subdivision

        // Loop over categories adding them one by one to the categories HTML string
        for (var i = 0; i < categories.length; i++) {
            var html = categoryHtml;
            html = insertProperty(html, "category_name", "" + categories[i].category_name);
            html = insertProperty(html, "category_code", categories[i].category_code);
            categoriesHtml += html;
        };

        // Add the closing tag to the categories HTML string and return it
        categoriesHtml += "</section>";
        return categoriesHtml;
    };

    // Define a function to insert the categories HTML string content in the 'main' selector
    function insertCategoriesHTML (categories) {

        // Load the categories-title-snippet
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml, 
            function (categoriesTitleHtml) {

                // Retrieve single category snippet
                $ajaxUtils.sendGetRequest(
                    categoryHtml, 
                    function (categoryHtml) {

                        // Assign/remove class 'active' to the navigation button
                        switchToActive("#navProjectsButton");
                        switchToUnactive(["#navHomeButton", "#navExpertiseButton", "#navAboutUsButton", "#navContactUsButton"]);

                        // Build up the string to be inserted in the HTML and insert it in the 'main' selector
                        var categoriesHtml = buildCategoriesHtml(categories, categoriesTitleHtml, categoryHtml);
                        insertHtml("#main", categoriesHtml);
                    }, 
                    false); // the element will not be converted from a JSON string
            },
            false); // the element will not be converted from a JSON string
    };

    // Define the function to be triggered to load the content in the 'main' selector
    dc.loadCategories = function () {
        showLoading("#main");
        $ajaxUtils.sendGetRequest(categoriesJson, insertCategoriesHTML, true); // the element will be converted from a JSON string
    };


    // ################################### ITEMS PAGE MANIPULATIONS #############################################

    // Define the URL to JSON from where to pull the data
    var itemsJson = "items_";

    // Define the paths to HTML pages to be inserted into the 'main' selector
    var itemsTitleHtml = "snippets/items-title-snippet.html";
    var itemHtml = "snippets/item-snippet.html";

    // Define a function to build up the items HTML string to be inserted in the 'main' selector
    function buildItemsHtml(items, itemsTitleHtml, itemHtml) {

        // In the 'items-title-snippet.html' replace the {{category_name}} and the {{category_special_instructions}} with their values 
        itemsTitleHtml = insertProperty(itemsTitleHtml, "category_name", items.category.category_name)
        itemsTitleHtml = insertProperty(itemsTitleHtml, "category_description", items.category.category_description)

        // Create the items HTML string from the 'items-title-snippet.html' and a section opening tag
        var itemsHtml = itemsTitleHtml;
        itemsHtml += "<section class='row'>";  // 'row' is a Bootstrap class to specify that we will be dealing with 1/12 width subdivision

        // Loop over items adding them one by one to the items HTML string
        for (var i = 0; i < items.items.length; i++) {
            var html = itemHtml; // create a new HTML string from the 'item-snippet.html'
            html = insertProperty(html, "category_code", items.category.category_code);
            html = insertProperty(html, "item_name", items.items[i].item_name);
            html = insertProperty(html, "item_code", items.items[i].item_code);
            html = insertProperty(html, "item_description", items.items[i].item_description); 

            // Add a clearfix after every second item
            if (i % 2 != 0) {
                html += "<div class='clearfix visible-lg-block visible-md-block'></div>" 
            };
            itemsHtml += html;
        };

        // Add the closing tag to the items HTML string and return it
        itemsHtml += "</section>";
        return itemsHtml;
    };

    // Define a function to insert the items HTML string content in the 'main' selector
    function insertItemsHTML (items) {

        // Load the items title snippet
        $ajaxUtils.sendGetRequest(
            itemsTitleHtml, 
            function (itemsTitleHtml) {

                // Retrieve item snippet
                $ajaxUtils.sendGetRequest(
                    itemHtml, 
                    function (itemHtml) {

                        // Assign/remove class 'active' to the navigation button
                        switchToActive("#navProjectsButton");
                        switchToUnactive(["#navHomeButton", "#navExpertiseButton", "#navAboutUsButton", "#navContactUsButton"]);

                        // Build up the string to be inserted in the HTML and insert it in the 'main' selector
                        var itemsHtml = buildItemsHtml(items, itemsTitleHtml, itemHtml);
                        insertHtml("#main", itemsHtml);
                    }, 
                    false); // the element will not be converted from a JSON string
            },
            false); // the element will not be converted from a JSON string
    };

    // Define the function to be triggered to load the content in the 'main' selector
    dc.loadItems = function (category_code) {
        showLoading("#main");
        $ajaxUtils.sendGetRequest(itemsJson + category_code + ".json", insertItemsHTML, true); // the element will be converted from a JSON string
    };


    // ################################### EXPERTISE PAGE MANIPULATIONS #############################################

    // Define the path to HTML page to be inserted into the 'main' selector
    var expertiseHtml = "snippets/expertise.html"
    
    // Define the function to be triggered to load the content in the 'main' selector
    dc.loadExpertise = function () {
        showLoading("#main");

        // Show loading gif and assign/remove class 'active' to the navigation button
        switchToActive("#navExpertiseButton");
        switchToUnactive(["#navHomeButton", "#navProjectsButton", "#navAboutUsButton", "#navContactUsButton"]);

        // Insert the snippet in the 'main' selector
        $ajaxUtils.sendGetRequest(
            expertiseHtml,
            function (expertiseHtml) {
                document.querySelector("#main").innerHTML = expertiseHtml;
            },
            false); // the element should not be converted from a JSON string (because we have an HTML and not a JSON)
    };

    // ################################### ABOUT US PAGE MANIPULATIONS #############################################

    // Define the path to HTML page to be inserted into the 'main' selector
    var aboutUsHtml = "snippets/about-us.html"
    
    // Define the function to be triggered to load the content in the 'main' selector
    dc.loadAboutUs = function () {
        
        // Show loading gif and assign/remove class 'active' to the navigation button
        showLoading("#main");
        switchToActive("#navAboutUsButton");
        switchToUnactive(["#navHomeButton", "#navProjectsButton", "#navExpertiseButton", "#navContactUsButton"]);

        // Insert the snippet in the 'main' selector
        $ajaxUtils.sendGetRequest(
            aboutUsHtml,
            function (aboutUsHtml) {
                document.querySelector("#main").innerHTML = aboutUsHtml;
            },
            false); // the element should not be converted from a JSON string (because we have an HTML and not a JSON)
    };

    // ################################### CONTACT US PAGE MANIPULATIONS #############################################

    // Define the path to HTML page to be inserted into the 'main' selector
    var contactUsHtml = "snippets/contact-us.html"
    var messageSentHtml = "snippets/message-sent.html"
    
    // Define the function to be triggered to load the content in the 'main' selector
    dc.loadContactUs = function () {
        
        // Show loading gif and assign/remove class 'active' to the navigation button
        showLoading("#main");
        switchToActive("#navContactUsButton");
        switchToUnactive(["#navHomeButton", "#navProjectsButton", "#navExpertiseButton", "#navAboutUsButton"]);

        // Insert the snippet in the 'main' selector
        $ajaxUtils.sendGetRequest(
            contactUsHtml,
            function (contactUsHtml) {
                document.querySelector("#main").innerHTML = contactUsHtml;
            },
            false); // the element should not be converted from a JSON string (because we have an HTML and not a JSON)
    };

    // Define the function to be triggered to load the content in the 'main' selector
    dc.loadMessageSent = function () {
        

        // Check for all the fields to be non-blank
        if ((document.getElementById("input-name").value != "") && 
           (document.getElementById("input-email").value != "") && 
           (document.getElementById("input-message").value != "")) {

            // Show loading gif and assign/remove class 'active' to the navigation button
            showLoading("#main");
            switchToActive("#navContactUsButton");
            switchToUnactive(["#navHomeButton", "#navProjectsButton", "#navExpertiseButton", "#navAboutUsButton"]);

            // Insert the snippet in the 'main' selector
            $ajaxUtils.sendGetRequest(
                messageSentHtml,
                function (messageSentHtml) {
                    document.querySelector("#main").innerHTML = messageSentHtml;
                },
                false); // the element should not be converted from a JSON string (because we have an HTML and not a JSON)
        } else {
            alert("Please fill in all the required fields")
            dc.loadContactUs()
        }
    };

    // ##############################################################################################################

    // Expose the 'dc' object to the global space
    global.$dc = dc;

})(window);
