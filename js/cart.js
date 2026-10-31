

/* 
   1. DATA AND HELPERS
    */

// The product list (used by the home page specials and the enquiry form).

var PRODUCTS = [
    { id: "sourdough",       name: "Sourdough Loaf",    category: "Breads",   price: 45,  image: "images/sourDough.jpg" },
    { id: "whole-wheat",     name: "Whole Wheat Bread", category: "Breads",   price: 20,  image: "images/wholeWheat.jpg" },
    { id: "rye",             name: "Rye Bread",         category: "Breads",   price: 55,  image: "images/ryeBread.jpg" },
    { id: "baguette",        name: "Baguette",          category: "Breads",   price: 45,  image: "images/baguet.jpg" },

    { id: "muffins",         name: "Muffins",           category: "Pastries", price: 5,   image: "images/Muffins.jpg" },
    { id: "scones",          name: "Scones",            category: "Pastries", price: 5,   image: "images/scones.jpg" },
    { id: "cupcakes",        name: "Cupcakes",          category: "Pastries", price: 6,   image: "images/cupcakes.jpg" },
    { id: "macarons",        name: "Macarons",          category: "Pastries", price: 12,  image: "images/macrons.jpg" },
    { id: "biscuits",        name: "Biscuits",          category: "Pastries", price: 4,   image: "images/biscuits.jpg" },
    { id: "chou-a-la-creme", name: "Chou a la Creme",   category: "Pastries", price: 18,  image: "images/Chou a la creme.jpg" },
    { id: "cinnamon-rolls",  name: "Cinnamon Rolls",    category: "Pastries", price: 25,  image: "images/CinnemonRoles.jpg" },

    { id: "chocolate-cake",  name: "Chocolate Cake",    category: "Cakes",    price: 200, image: "images/choclate cake.jpg" },
    { id: "carrot-cake",     name: "Carrot Cake",       category: "Cakes",    price: 250, image: "images/carrotCake.jpg" },
    { id: "sponge-cake",     name: "Sponge Cake",       category: "Cakes",    price: 400, image: "images/Sponge cake.jpg" },
    { id: "chiffon-cake",    name: "Chiffon Cake",      category: "Cakes",    price: 560, image: "images/Chiffon cake.jpg" },
    { id: "fruit-cake",      name: "Fruit Cake",        category: "Cakes",    price: 340, image: "images/Fruit cake.jpg" },
    { id: "tiramisu-cake",   name: "Tiramisu Cake",     category: "Cakes",    price: 400, image: "images/Tiramisu cake.jpg" }
];

// Helper functions shared by the contact form and the enquiry form.
var FormHelper = {

    // email check: something@something.something
    isEmail: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    // South African numbers: 0781234567 or +27781234567 
    isPhone: function (value) {
        var digitsOnly = value.replace(/[\s-]/g, "");
        return /^(\+27|0)[0-9]{9}$/.test(digitsOnly);
    },

    // Shows an error message under a field
   
    showError: function (field, message) {
        var errorElement = document.getElementById(field.id + "-error");
        if (errorElement) {
            errorElement.textContent = message;
        }
        field.setAttribute("aria-invalid", "true");
        field.classList.add("input-error");
    },

    clearError: function (field) {
        var errorElement = document.getElementById(field.id + "-error");
        if (errorElement) {
            errorElement.textContent = "";
        }
        field.removeAttribute("aria-invalid");
        field.classList.remove("input-error");
    },

    
    checkField: function (field, getError) {
        var message = getError(field);
        if (message) {
            FormHelper.showError(field, message);
            return false;
        }
        FormHelper.clearError(field);
        return true;
    },

    // Checks ALL fields. Returns the first invalid field, or null if all are fine.
    checkAll: function (fields, getError) {
        var firstInvalid = null;
        fields.forEach(function (field) {
            if (!FormHelper.checkField(field, getError) && firstInvalid === null) {
                firstInvalid = field;
            }
        });
        return firstInvalid;
    }
};


document.addEventListener("DOMContentLoaded", function () {
    "use strict";

        // Every page
    runSafely(updateFooterYear);
    runSafely(showOpenStatus);
    runSafely(addBackToTopButton);
    runSafely(fadeInSections);

    // Home page
    runSafely(showGreeting);
    runSafely(showSpecials);

    // About page
    runSafely(setupAccordion);

    // Products page
    runSafely(checkPricesMatch);
    runSafely(setupCart);
    runSafely(setupProductTools);
    runSafely(setupLightbox);

    // Contact page
    runSafely(setupMap);
    runSafely(setupContactForm);

    // Enquiry page
    runSafely(setupEnquiryForm);

 function runSafely(setupFunction) {
        try {
            setupFunction();
        } catch (error) {
            console.error("Problem in " + setupFunction.name + ":", error);
        }
    }

    function checkPricesMatch() {
        document.querySelectorAll(".product-card[data-id]").forEach(function (card) {
            var product = PRODUCTS.find(function (p) {
                return p.id === card.dataset.id;
            });

            if (!product) {
                console.warn("product.html has a product that is not in PRODUCTS: " + card.dataset.id);
            } else if (product.price !== Number(card.dataset.price)) {
                console.warn("Price mismatch for " + card.dataset.id + ": product.html says " +
                    card.dataset.price + " but PRODUCTS says " + product.price);
            }
        });
    }

    // Creates an element, gives it a class and some text, and returns it.
    function makeElement(tag, className, text) {
        var el = document.createElement(tag);
        if (className) {
            el.className = className;
        }
        if (text) {
            el.textContent = text;
        }
        return el;
    }

    function formatPrice(amount) {
        return "R" + amount.toFixed(2);
    }


    /* 
       2. EVERY PAGE
       */

    // Footer: current year
    function updateFooterYear() {
        var footerText = document.querySelector("footer p");
        if (!footerText) return;
        footerText.innerHTML = "&copy; " + new Date().getFullYear() + " Baked Bunz. All rights reserved.";
    }

    // Footer: "open now" / "closed" message
    function showOpenStatus() {
        var footer = document.querySelector("footer");
        if (!footer) return;

        // show the time in Johannesburg, wherever the visitor is.
        var now = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));
        var day = now.getDay();                          // 0 = Sunday ... 6 = Saturday
        var hour = now.getHours() + now.getMinutes() / 60;
        var isOpen = day >= 1 && day <= 6 && hour >= 6 && hour < 15;

        var status = makeElement("p", isOpen ? "status-open" : "status-closed");
        status.id = "open-status";
        if (isOpen) {
            status.textContent = "We are open now (Mon–Sat, 06:00–15:00)";
        } else {
            status.textContent = "We are closed right now. Hours: Mon–Sat, 06:00–15:00";
        }
        footer.appendChild(status);
    }

    // "Back to top" button
    function addBackToTopButton() {
        var button = makeElement("button", "back-to-top", "↑ Top");
        button.type = "button";
        button.id = "back-to-top";
        button.setAttribute("aria-label", "Back to top");
        button.hidden = true;
        document.body.appendChild(button);

        // Show the button when the visitor has scrolled down a bit.
        window.addEventListener("scroll", function () {
            button.hidden = window.scrollY < 300;
        });

        button.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Sections fade in as you scroll to them
    function fadeInSections() {
        var sections = document.querySelectorAll("main section");
        // Older browsers without IntersectionObserver just show everything.
        if (!("IntersectionObserver" in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);   // only animate once
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(function (section) {
            section.classList.add("fade-in");
            observer.observe(section);
        });
    }


    /* 
       3. HOME PAGE
      */

    // Greeting that depends on the time of day
    function showGreeting() {
        var greeting = document.getElementById("greeting");
        if (!greeting) return;

        var hour = new Date().getHours();
        if (hour < 12) {
            greeting.textContent = "Good morning! The bread is fresh out of the oven.";
        } else if (hour < 17) {
            greeting.textContent = "Good afternoon! Come and see what is in the display.";
        } else {
            greeting.textContent = "Good evening! Place an order now for tomorrow morning.";
        }
    }

    // Today's specials
    function showSpecials() {
        var list = document.getElementById("specials-list");
        var intro = document.getElementById("specials-intro");
        if (!list || !intro) return;

        var DISCOUNT = 0.10;
        var today = new Date();
        var dayNumber = today.getDay();   // the special items change every day

        intro.textContent = "Our " + today.toLocaleDateString("en-ZA", { weekday: "long" }) +
            " picks are 10% off today only.";

        for (var i = 0; i < 3; i++) {
            var product = PRODUCTS[(dayNumber * 3 + i) % PRODUCTS.length];
            var salePrice = product.price * (1 - DISCOUNT);

            var card = makeElement("li", "product-card special-card");

            var image = document.createElement("img");
            image.src = product.image;
            image.alt = product.name;
            card.appendChild(image);

            card.appendChild(makeElement("span", "special-badge", "10% OFF TODAY"));
            card.appendChild(makeElement("span", "product-name", product.name));

            var priceLine = makeElement("span", "product-price");
            priceLine.appendChild(makeElement("s", "", formatPrice(product.price)));
            priceLine.appendChild(document.createTextNode(" " + formatPrice(salePrice)));
            card.appendChild(priceLine);

            var link = makeElement("a", "special-link", "See on Products page");
            link.href = "product.html";
            card.appendChild(link);

            list.appendChild(card);
        }
    }


    /* 
       4. ABOUT PAGE
        */

    //  click a question to open its answer
    function setupAccordion() {
        var headers = document.querySelectorAll(".accordion-header");
        if (headers.length === 0) return;

        headers.forEach(function (header) {
            header.addEventListener("click", function () {
                var wasOpen = header.getAttribute("aria-expanded") === "true";

                // close every panel first ...
                headers.forEach(function (h) {
                    h.setAttribute("aria-expanded", "false");
                    document.getElementById(h.getAttribute("aria-controls")).hidden = true;
                });

                // ... then open the clicked one 
                if (!wasOpen) {
                    header.setAttribute("aria-expanded", "true");
                    document.getElementById(header.getAttribute("aria-controls")).hidden = false;
                }
            });
        });
    }


    /* 
       5. PRODUCTS PAGE
       */

    // ----- shopping cart (kept in localStorage so it survives a refresh) -----
    function setupCart() {
        var cartToggle = document.getElementById("cart-toggle");
        if (!cartToggle) return;   // this page has no cart

        var STORAGE_KEY = "bakedBunzCart";

        var cartCount = document.getElementById("cart-count");
        var cartPanel = document.getElementById("cart-panel");
        var cartOverlay = document.getElementById("cart-overlay");
        var cartClose = document.getElementById("cart-close");
        var cartItemsEl = document.getElementById("cart-items");
        var cartEmpty = document.getElementById("cart-empty");
        var cartTotalEl = document.getElementById("cart-total");
        var cartMessage = document.getElementById("cart-message");
        var checkoutBtn = document.getElementById("checkout-btn");
        var clearBtn = document.getElementById("clear-cart");

        // cart = { productId: { id, name, price, qty } }
        var cart = loadCart();

        function loadCart() {
            try {
                var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
                return saved && typeof saved === "object" ? saved : {};
            } catch (e) {
                return {};
            }
        }

        function saveCart() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
            } catch (e) {
                // storage unavailable - the cart still works for this visit
            }
        }

        function totalItems() {
            return Object.values(cart).reduce(function (sum, item) {
                return sum + item.qty;
            }, 0);
        }

        function totalPrice() {
            return Object.values(cart).reduce(function (sum, item) {
                return sum + item.price * item.qty;
            }, 0);
        }

        function addToCart(id, name, price) {
            if (cart[id]) {
                cart[id].qty += 1;
            } else {
                cart[id] = { id: id, name: name, price: price, qty: 1 };
            }
            cartMessage.textContent = "";
            saveCart();
            render();
        }

        function changeQty(id, change) {
            if (!cart[id]) return;
            cart[id].qty += change;
            if (cart[id].qty <= 0) {
                delete cart[id];
            }
            saveCart();
            render();
        }

        function removeItem(id) {
            delete cart[id];
            saveCart();
            render();
        }

        function clearCart() {
            cart = {};
            saveCart();
            cartMessage.textContent = "";
            render();
        }

        function makeButton(text, label, action) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = text;
            btn.setAttribute("aria-label", label);
            btn.dataset.action = action;
            btn.className = "cart-btn cart-btn-" + action;
            return btn;
        }

        
        function render() {
            cartItemsEl.innerHTML = "";

            Object.values(cart).forEach(function (item) {
                var li = document.createElement("li");
                li.className = "cart-item";
                li.dataset.id = item.id;

                var info = document.createElement("div");
                info.className = "cart-item-info";
                var nameEl = document.createElement("span");
                nameEl.className = "cart-item-name";
                nameEl.textContent = item.name;
                var lineEl = document.createElement("span");
                lineEl.className = "cart-item-line";
                lineEl.textContent = formatPrice(item.price) + " each = " + formatPrice(item.price * item.qty);
                info.appendChild(nameEl);
                info.appendChild(lineEl);

                var controls = document.createElement("div");
                controls.className = "cart-item-controls";
                controls.appendChild(makeButton("−", "Decrease quantity of " + item.name, "decrease"));
                var qtyEl = document.createElement("span");
                qtyEl.className = "cart-item-qty";
                qtyEl.textContent = item.qty;
                controls.appendChild(qtyEl);
                controls.appendChild(makeButton("+", "Increase quantity of " + item.name, "increase"));
                controls.appendChild(makeButton("Remove", "Remove " + item.name + " from cart", "remove"));

                li.appendChild(info);
                li.appendChild(controls);
                cartItemsEl.appendChild(li);
            });

            var count = totalItems();
            cartCount.textContent = count;
            cartTotalEl.textContent = formatPrice(totalPrice());
            cartEmpty.hidden = count > 0;
            checkoutBtn.disabled = count === 0;
            clearBtn.disabled = count === 0;
        }

        function openCart() {
            cartPanel.classList.add("open");
            cartPanel.setAttribute("aria-hidden", "false");
            cartOverlay.hidden = false;
            cartToggle.setAttribute("aria-expanded", "true");
            cartClose.focus();
        }

        function closeCart() {
            cartPanel.classList.remove("open");
            cartPanel.setAttribute("aria-hidden", "true");
            cartOverlay.hidden = true;
            cartToggle.setAttribute("aria-expanded", "false");
            cartToggle.focus();
        }

        // "Add to Cart" buttons (one listener for the whole page)
        document.addEventListener("click", function (e) {
            var addBtn = e.target.closest(".add-to-cart");
            if (!addBtn) return;

            var card = addBtn.closest(".product-card");
            var price = parseFloat(card.dataset.price);
            if (isNaN(price)) return;

            addToCart(card.dataset.id, card.dataset.name, price);

            // brief visual confirmation on the button
            var original = addBtn.textContent;
            addBtn.textContent = "Added ✓";
            addBtn.disabled = true;
            setTimeout(function () {
                addBtn.textContent = original;
                addBtn.disabled = false;
            }, 800);
        });

        // +, - and Remove inside the cart
        cartItemsEl.addEventListener("click", function (e) {
            var btn = e.target.closest("button[data-action]");
            if (!btn) return;
            var id = btn.closest(".cart-item").dataset.id;

            if (btn.dataset.action === "increase") changeQty(id, 1);
            if (btn.dataset.action === "decrease") changeQty(id, -1);
            if (btn.dataset.action === "remove") removeItem(id);
        });

        cartToggle.addEventListener("click", function () {
            if (cartPanel.classList.contains("open")) {
                closeCart();
            } else {
                openCart();
            }
        });
        cartClose.addEventListener("click", closeCart);
        cartOverlay.addEventListener("click", closeCart);
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && cartPanel.classList.contains("open")) {
                closeCart();
            }
        });

        clearBtn.addEventListener("click", clearCart);

        // Placing an order
        checkoutBtn.addEventListener("click", function () {
            if (totalItems() === 0) return;
            var summary = "Thank you! Your order of " + totalItems() +
                " item(s) totalling " + formatPrice(totalPrice()) +
                " has been received. We will contact you to confirm collection.";
            cart = {};
            saveCart();
            render();
            cartMessage.textContent = summary;
        });

        render();
    }

    //  search, category filter and sorting
    function setupProductTools() {
        var searchInput = document.getElementById("product-search");
        var categorySelect = document.getElementById("category-filter");
        var sortSelect = document.getElementById("sort-products");
        var resetButton = document.getElementById("reset-filters");
        var resultCount = document.getElementById("result-count");
        var noResults = document.getElementById("no-results");
        var cards = document.querySelectorAll(".product-card");

        if (!searchInput || cards.length === 0) return;   

        
        cards.forEach(function (card, index) {
            card.dataset.index = index;
        });

        function applyFilters() {
            var searchText = searchInput.value.trim().toLowerCase();
            var category = categorySelect.value;
            var shown = 0;

            cards.forEach(function (card) {
                var section = card.closest("section");
                var matchesText = card.dataset.name.toLowerCase().indexOf(searchText) !== -1;
                var matchesCategory = category === "all" || section.id === category;
                var visible = matchesText && matchesCategory;

                card.hidden = !visible;
                if (visible) {
                    shown++;
                }
            });

            // Hide a whole section if nothing in it matches.
            var sections = document.querySelectorAll("#breads, #pastries, #cakes");
            sections.forEach(function (section) {
                var hasVisibleCard = section.querySelector(".product-card:not([hidden])") !== null;
                section.hidden = !hasVisibleCard;
            });

            resultCount.textContent = "Showing " + shown + " of " + cards.length + " products";
            noResults.hidden = shown !== 0;
        }

        function sortProducts() {
            var mode = sortSelect.value;
            var lists = document.querySelectorAll(".product-list");

            lists.forEach(function (list) {
                var items = Array.prototype.slice.call(list.querySelectorAll(".product-card"));

                items.sort(function (a, b) {
                    if (mode === "name") {
                        return a.dataset.name.localeCompare(b.dataset.name);
                    }
                    if (mode === "price-low") {
                        return Number(a.dataset.price) - Number(b.dataset.price);
                    }
                    if (mode === "price-high") {
                        return Number(b.dataset.price) - Number(a.dataset.price);
                    }
                    return Number(a.dataset.index) - Number(b.dataset.index);   // default order
                });

                // appendChild MOVES an element that is already on the page
                items.forEach(function (item) {
                    list.appendChild(item);
                });
            });
        }

        searchInput.addEventListener("input", applyFilters);
        categorySelect.addEventListener("change", applyFilters);
        sortSelect.addEventListener("change", sortProducts);

        resetButton.addEventListener("click", function () {
            searchInput.value = "";
            categorySelect.value = "all";
            sortSelect.value = "default";
            sortProducts();
            applyFilters();
        });

        applyFilters();
    }

    //lightbox: click a picture to see it bigger 
    function setupLightbox() {
        // only on the products page (the one with the search box)
        if (!document.getElementById("product-search")) return;

        var cards = document.querySelectorAll(".product-card");

         var bigImage = document.createElement("img");
        bigImage.alt = "";
        
        var lightbox = document.createElement("div");
        lightbox.className = "lightbox";
        lightbox.hidden = true;
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "Enlarged product picture");

        var closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "lightbox-close";
        closeButton.setAttribute("aria-label", "Close picture");
        closeButton.innerHTML = "&times;";

        var bigImage = document.createElement("img");
        var caption = document.createElement("p");

        lightbox.appendChild(closeButton);
        lightbox.appendChild(bigImage);
        lightbox.appendChild(caption);
        document.body.appendChild(lightbox);

        var lastFocused = null;

        function openLightbox(image) {
            var card = image.closest(".product-card");
            lastFocused = image;
            bigImage.src = image.src;
            bigImage.alt = image.alt;
            caption.textContent = card.dataset.name + " - R" + Number(card.dataset.price).toFixed(2);
            lightbox.hidden = false;
            closeButton.focus();
        }

        function closeLightbox() {
            lightbox.hidden = true;
            if (lastFocused) {
                lastFocused.focus();
            }
        }

        cards.forEach(function (card) {
            var image = card.querySelector("img");
            if (!image) return;

            // make the picture usable with a keyboard as well as a mouse
            image.tabIndex = 0;
            image.setAttribute("role", "button");
            image.setAttribute("aria-label", "View larger picture of " + card.dataset.name);

            image.addEventListener("click", function () {
                openLightbox(image);
            });
            image.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(image);
                }
            });
        });

        closeButton.addEventListener("click", closeLightbox);

        // clicking the dark background  closes it
        lightbox.addEventListener("click", function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && !lightbox.hidden) {
                closeLightbox();
            }
        });
    }


    /* 
       6. CONTACT PAGE
     */

    // Interactive map 
    function setupMap() {
        var mapElement = document.getElementById("map");
        if (!mapElement) return;

        // If the Leaflet library did not load (e.g. no internet), say so politely.
        if (typeof L === "undefined") {
            mapElement.textContent = "The map could not be loaded. Our address is shown above.";
            return;
        }

        
        var position = [-26.2041, 28.0473];

        var map = L.map("map").setView(position, 14);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        L.marker(position)
            .addTo(map)
            .bindPopup("<strong>Baked Bunz</strong><br>15 Great Wide Avenue, NewWood<br>Mon–Sat, 06:00–15:00")
            .openPopup();
    }

    // Contact form: validates, then builds an email the visitor can send
    function setupContactForm() {
        var form = document.getElementById("contactForm");
        if (!form) return;

        var RECIPIENT = "info@bakedbunz.co.za";   // where the email will be sent
        var MAX_LENGTH = 500;

        var nameField = document.getElementById("name");
        var emailField = document.getElementById("email");
        var phoneField = document.getElementById("phone");
        var typeField = document.getElementById("type");
        var messageField = document.getElementById("message");
        var counter = document.getElementById("message-counter");
        var statusText = document.getElementById("form-status");
        var previewBox = document.getElementById("email-preview-box");
        var previewText = document.getElementById("email-preview");
        var sendLink = document.getElementById("send-email-link");

        var fields = [nameField, emailField, phoneField, typeField, messageField];

        // Returns an error message for a field, or "" if the field is fine.
        function getError(field) {
            var value = field.value.trim();

            if (field === nameField && value.length < 2) {
                return "Please enter your name (at least 2 characters).";
            }
            if (field === emailField) {
                if (value === "") return "Please enter your email address.";
                if (!FormHelper.isEmail(value)) return "That email address does not look right (example: name@email.com).";
            }
           
            if (field === phoneField && value !== "" && !FormHelper.isPhone(value)) {
                return "Please enter a valid South African number (example: 078 123 4567).";
            }
            if (field === typeField && value === "") {
                return "Please choose the type of message.";
            }
            if (field === messageField) {
                if (value.length < 10) return "Your message must be at least 10 characters.";
                if (value.length > MAX_LENGTH) return "Your message must be " + MAX_LENGTH + " characters or less.";
            }
            return "";
        }

        // Check each field when the visitor leaves it
        fields.forEach(function (field) {
            field.addEventListener("blur", function () {
                FormHelper.checkField(field, getError);
            });
        });

        // Live character counter
        messageField.addEventListener("input", function () {
            counter.textContent = messageField.value.length + " / " + MAX_LENGTH;
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();   // stop the page from reloading
            previewBox.hidden = true;

            var firstInvalid = FormHelper.checkAll(fields, getError);
            if (firstInvalid) {
                statusText.textContent = "Please fix the highlighted fields and try again.";
                firstInvalid.focus();
                return;
            }

            buildEmail();
        });

        // Puts the form answers together into an email the visitor can send.
        function buildEmail() {
            var subject = "Baked Bunz website: " + typeField.value;
            var phone = phoneField.value.trim() || "not given";

            var body = "Name: " + nameField.value.trim() + "\n" +
                       "Email: " + emailField.value.trim() + "\n" +
                       "Phone: " + phone + "\n" +
                       "Message type: " + typeField.value + "\n\n" +
                       messageField.value.trim();

            // 
            var mailtoLink = "mailto:" + RECIPIENT +
                             "?subject=" + encodeURIComponent(subject) +
                             "&body=" + encodeURIComponent(body);

            previewText.textContent = "To: " + RECIPIENT + "\nSubject: " + subject + "\n\n" + body;
            sendLink.href = mailtoLink;
            previewBox.hidden = false;
            statusText.textContent = "Your email is ready. Check it below, then click the button to send it.";
        }
    }


    /*
       7. ENQUIRY PAGE
       */

    function setupEnquiryForm() {
        var form = document.getElementById("enquiryform");
        if (!form) return;

       
        var SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

        var BULK_QUANTITY = 10;      // order this many or more ...
        var BULK_DISCOUNT = 0.10;    // ... and get 10% off
        var CUSTOM_NOTICE_DAYS = 3;  // custom cakes need this many days notice

        var nameField = document.getElementById("name");
        var emailField = document.getElementById("email");
        var phoneField = document.getElementById("phone");
        var productField = document.getElementById("product");
        var quantityField = document.getElementById("quantity");
        var dateField = document.getElementById("date");
        var messageField = document.getElementById("message");
        var submitButton = document.getElementById("enquiry-submit");
        var statusText = document.getElementById("enquiry-status");
        var responseBox = document.getElementById("enquiry-response");

        var fields = [nameField, emailField, phoneField, productField, quantityField, dateField, messageField];

        fillProductList();
        setEarliestDate();

        // Fill the product drop-down from the PRODUCTS list
        function fillProductList() {
            var categories = ["Breads", "Pastries", "Cakes"];
            categories.forEach(function (category) {
                var group = document.createElement("optgroup");
                group.label = category;

                PRODUCTS.forEach(function (product) {
                    if (product.category === category) {
                        var option = document.createElement("option");
                        option.value = product.id;
                        option.textContent = product.name + " - R" + product.price.toFixed(2);
                        group.appendChild(option);
                    }
                });
                productField.appendChild(group);
            });

            var custom = document.createElement("option");
            custom.value = "custom";
            custom.textContent = "Custom cake (quote on request)";
            productField.appendChild(custom);
        }

        // The earliest date a visitor can pick is tomorrow.
        function setEarliestDate() {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var month = String(tomorrow.getMonth() + 1).padStart(2, "0");
            var day = String(tomorrow.getDate()).padStart(2, "0");
            dateField.min = tomorrow.getFullYear() + "-" + month + "-" + day;
        }

        // Returns an error message for a field, or "" if the field is fine.
        function getError(field) {
            var value = field.value.trim();

            if (field === nameField && value.length < 2) {
                return "Please enter your name (at least 2 characters).";
            }
            if (field === emailField) {
                if (value === "") return "Please enter your email address.";
                if (!FormHelper.isEmail(value)) return "That email address does not look right (example: name@email.com).";
            }
            if (field === phoneField && value !== "" && !FormHelper.isPhone(value)) {
                return "Please enter a valid South African number (example: 078 123 4567).";
            }
            if (field === productField && value === "") {
                return "Please choose a product.";
            }
            if (field === quantityField) {
                var quantity = Number(value);
                if (value === "" || isNaN(quantity) || quantity < 1 || quantity > 50 || Math.floor(quantity) !== quantity) {
                    return "Please enter a whole number between 1 and 50.";
                }
            }
            if (field === dateField) {
                if (value === "") return "Please choose the date you need your order.";

                var chosen = new Date(value + "T00:00:00");
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                var daysAway = Math.round((chosen - today) / 86400000);   // milliseconds in a day

                if (daysAway < 1) return "Please choose a date from tomorrow onwards.";
                if (chosen.getDay() === 0) return "We are closed on Sundays. Please pick another day.";
                if (productField.value === "custom" && daysAway < CUSTOM_NOTICE_DAYS) {
                    return "Custom cakes need at least " + CUSTOM_NOTICE_DAYS + " days notice.";
                }
            }
            if (field === messageField && value.length > 300) {
                return "Your message must be 300 characters or less.";
            }
            return "";
        }

        // Check each field when the visitor leaves it
        fields.forEach(function (field) {
            field.addEventListener("blur", function () {
                FormHelper.checkField(field, getError);
            });
        });

        // The date rules depend on the product, so re-check the date when it changes
        productField.addEventListener("change", function () {
            FormHelper.checkField(productField, getError);
            if (dateField.value !== "") {
                FormHelper.checkField(dateField, getError);
            }
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();   // stop the page from reloading
            responseBox.hidden = true;

            var firstInvalid = FormHelper.checkAll(fields, getError);
            if (firstInvalid) {
                statusText.textContent = "Please fix the highlighted fields and try again.";
                firstInvalid.focus();
                return;
            }

            var enquiry = {
                name: nameField.value.trim(),
                email: emailField.value.trim(),
                phone: phoneField.value.trim(),
                product: productField.value,
                quantity: Number(quantityField.value),
                date: dateField.value,
                message: messageField.value.trim()
            };

            statusText.textContent = "Sending your enquiry...";
            submitButton.disabled = true;

            sendToServer(enquiry)
                .then(function () {
                    statusText.textContent = "";
                    showResponse(enquiry);
                    form.reset();
                })
                .catch(function () {
                    statusText.textContent = "Sorry, we could not send your enquiry. Please try again, or use our Contact page.";
                })
                .finally(function () {
                    submitButton.disabled = false;
                });
        });

       
        function sendToServer(data) {
            return fetch(SERVER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (!response.ok) {
                    throw new Error("Server answered with status " + response.status);
                }
                return response.json();
            });
        }

        function addLine(text) {
            var paragraph = document.createElement("p");
            paragraph.textContent = text;
            responseBox.appendChild(paragraph);
        }

        // The answer shown to the visitor: price and availability
        function showResponse(enquiry) {
            responseBox.innerHTML = "";

            var firstName = enquiry.name.split(" ")[0];
            var heading = document.createElement("h3");
            heading.textContent = "Thank you, " + firstName + "!";
            responseBox.appendChild(heading);

            var niceDate = new Date(enquiry.date + "T00:00:00").toLocaleDateString("en-ZA", {
                weekday: "long", day: "numeric", month: "long", year: "numeric"
            });

            if (enquiry.product === "custom") {
                addLine("Custom cakes are priced after we see your request, so we will email you a quote within 1 working day.");
                addLine("Availability: we can bake it for " + niceDate + ".");
            } else {
                var product = PRODUCTS.find(function (p) {
                    return p.id === enquiry.product;
                });

                var subtotal = product.price * enquiry.quantity;
                var discount = enquiry.quantity >= BULK_QUANTITY ? subtotal * BULK_DISCOUNT : 0;
                var total = subtotal - discount;

                addLine("Your enquiry: " + enquiry.quantity + " x " + product.name);
                addLine("Price: R" + product.price.toFixed(2) + " each = R" + subtotal.toFixed(2));
                if (discount > 0) {
                    addLine("Bulk discount (10% for " + BULK_QUANTITY + " or more): -R" + discount.toFixed(2));
                }
                addLine("Estimated total: R" + total.toFixed(2));
                addLine("Availability: yes, this can be ready for collection on " + niceDate + " between 06:00 and 15:00.");
            }

            addLine("We will confirm everything by email at " + enquiry.email + ".");
            responseBox.hidden = false;
            responseBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }
});