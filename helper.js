import { priceOptionMap, basicColorsObj, basicSizesObj } from "./data.js";

export let cartCheckoutObject = {};

/*
*Creates Dropdown with select and options
*return dropdown
*@param {Object} option list to be displayed in the dropdown
*@param {String} class name - each select element
*@param {Number} unique id - each select element
*/
function createDropdown(optionList = {}, className = "", uniqueId = 0) {
    const dropdown = document.createElement("select");
    dropdown.className = className;
    dropdown.id = uniqueId;
    for (const text in optionList) {
        const option = document.createElement("option");
        option.textContent = text;
        option.value = optionList[text];
        dropdown.appendChild(option);
    }
    return dropdown;

}

/*
*Creates table row  with data attached to data cells
*no return
*@param {html element} table body
*@param {Number} - unique id - numbering rows
*@param {Object} - size options for dropdown
*@param {Object} - color options for dropdown 
*/

function addTableRow(tbody, index, basicSizesObj, basicColorsObj) {
    const tr = document.createElement('tr');

    const rowNumberTh = document.createElement('th');
    rowNumberTh.scope = "row";
    rowNumberTh.textContent = `#${index + 1}`;
    tr.appendChild(rowNumberTh);

    //creating dropdown and adding to the table row data
    const sizeTd = document.createElement('td');
    sizeTd.appendChild(createDropdown(basicSizesObj, "size-dropdown", `size-${index}`));
    tr.appendChild(sizeTd);

    const colorTd = document.createElement('td');
    colorTd.appendChild(createDropdown(basicColorsObj, "color-dropdown", `color-${index}`));
    tr.appendChild(colorTd);

    tbody.appendChild(tr);
}

/*
*Creates expanded card with table data
*return final expanded UI html element - section
*/

function generateExpandedCard() {
    const expandedCard = document.createElement('section');
    expandedCard.className = "extra-content";

    //generating table of the expanded content
    const table = document.createElement('table');
    table.id = "dynamicTable";

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const emptyTh = document.createElement('th');
    headerRow.appendChild(emptyTh);

    const sizeTh = document.createElement('th');
    sizeTh.textContent = "Sizes"
    headerRow.appendChild(sizeTh);

    const colorTh = document.createElement('th');
    colorTh.textContent = "Colors"
    headerRow.appendChild(colorTh);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    //Generating or adding table rows - table body
    //table row data - basicSizes and basicColors objects 
    for (let i = 0; i < 2; i++) {
        addTableRow(tbody, i, basicSizesObj, basicColorsObj);
    }

    table.appendChild(tbody);

    expandedCard.appendChild(table);

    return expandedCard;
}

/*
*Creates Price card  
*returns final generated UI html element - label
*@param {Object} - with attributes - to display the dynamic content in it
**@attribute {popular} - true/false - if true Most popular tag attached to the card 
**@attribute {general comment} - string - any informational text - like "standard prize" 
*/

function generatePriceCard({ title="", offerPercentage=0, originalPrice=0, currentPrice=0, generalComment="", popular=false } = {}) {
    // Create the label with class "price-card" and for attribute
    const label = document.createElement('label');
    label.className = 'price-card';


    // Creating main-content section
    const mainContent = document.createElement('section');
    mainContent.className = 'main-content';

    // Creating radio input
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'unit';
    input.id = title;
    input.value = title;

    // Append input to mainContent
    mainContent.appendChild(input);

    // Create main-info section
    const mainInfo = document.createElement('section');
    mainInfo.className = 'main-info';

    // Create title-row div
    const titleRow = document.createElement('div');
    titleRow.className = 'title-row';

    // Create strong for unit-title
    const unitTitle = document.createElement('strong');
    unitTitle.className = 'unit-title';
    unitTitle.textContent = title;

    // Create discount-badge span
    const discountBadge = document.createElement('span');
    discountBadge.className = 'discount-badge';
    discountBadge.textContent = `${offerPercentage}% Off`;

    // Append strong and span to titleRow
    titleRow.appendChild(unitTitle);
    titleRow.appendChild(discountBadge);

    // Append titleRow to mainInfo
    mainInfo.appendChild(titleRow);

    // Create comment span
    const comment = document.createElement('span');
    comment.className = 'comment';
    comment.textContent = generalComment;

    // Append comment to mainInfo
    mainInfo.appendChild(comment);

    // Append mainInfo to mainContent
    mainContent.appendChild(mainInfo);

    // Create price-info section
    const priceInfo = document.createElement('section');
    priceInfo.className = 'price-info';

    // Create price-now span
    const priceNow = document.createElement('span');
    priceNow.className = 'price-now';
    priceNow.textContent = `$${currentPrice}.00 USD`;

    // Create price-original del element
    const priceOriginal = document.createElement('del');
    priceOriginal.className = 'price-original';
    priceOriginal.textContent = `$${originalPrice}.00 USD`;

    // Append priceNow and priceOriginal to priceInfo
    priceInfo.appendChild(priceNow);
    priceInfo.appendChild(priceOriginal);

    // Append priceInfo to mainContent
    mainContent.appendChild(priceInfo);

    // Append mainContent to label
    label.appendChild(mainContent);

    let expandedContent = generateExpandedCard();

    label.appendChild(expandedContent);

    if (popular) {
        let tag = document.createElement('span');
        tag.className = "card-label";
        tag.textContent = "MOST POPULAR"
        label.appendChild(tag);
    }
    return label;

}

/*
*Creates Middle section - list of price option cards  
*returns final generated UI html element - form
*/

export const generatePriceOptionSection = function () {
    const form = document.createElement('form');
    form.className = "price-option-section"
    for (let priceOption of priceOptionMap.values()) {
        let list = generatePriceCard(priceOption);
        form.appendChild(list);
    }
    return form;
}

/*
*Updates cart price - based on selection 
*no return 
*@param {Number} - updated cart price
*/

function updateCartPrice(newPrice) {
    const totalPriceLabel = document.getElementById('total-price-label');
    if (totalPriceLabel) {
        totalPriceLabel.textContent = `Total : $${newPrice}.00 USD`;
    }
}

/*
*Adds event listeners to radio buttons  
*no return
*/

export const addEventListeners = function () {
    const cards = document.querySelectorAll('.price-card');
    const radios = document.querySelectorAll('input[type="radio"][name="unit"]');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            cards.forEach(card => card.classList.remove('active'));
            if (radio.checked) {
                let selectedPriceCard = radio.closest('.price-card');
                selectedPriceCard.classList.add('active');
                let selectedValue = 0;
                cartCheckoutObject = selectedValue = priceOptionMap.get(radio.value);
                selectedValue = selectedValue?.currentPrice;
                updateCartPrice(selectedValue);
            }
        });
    });
}

/*
*Creates Complete UI  
*returns final generated UI html element - section
*/
export const generateDiscountCardInterface = function () {
    const section = document.createElement('section');
    section.className = "discount-card"

    //creating header with header text and title
    const header = document.createElement('header');

    const dividerLine = document.createElement('hr');
    dividerLine.id = "divider-line";
    header.appendChild(dividerLine);

    const cardTitle = document.createElement('h2');
    cardTitle.id = "card-title";
    cardTitle.textContent = "YAY! It's BOGO";
    header.appendChild(cardTitle);
    section.appendChild(header);

    //adding price options
    const midSection = generatePriceOptionSection();
    section.appendChild(midSection);


    //creating footer - button, final cart price summary
    const footer = document.createElement('footer');


    //creating cart summary
    const cartSummary = document.createElement('div');
    cartSummary.className = "cart-summary";

    const deliveryLabel = document.createElement('span');
    deliveryLabel.id = "delivery-label";
    deliveryLabel.textContent = "Free Delivery"
    cartSummary.appendChild(deliveryLabel);

    const totalPriceLabel = document.createElement('span');
    totalPriceLabel.id = "total-price-label"
    totalPriceLabel.textContent = `Total : $0 USD`;
    cartSummary.appendChild(totalPriceLabel);

    footer.appendChild(cartSummary)

    const addToCartButton = document.createElement('button');
    addToCartButton.type = "button";
    addToCartButton.id = "add-to-cart";
    addToCartButton.textContent = "+ Add to Cart";

    footer.appendChild(addToCartButton);

    const signature = document.createElement('h6');
    signature.id = "signature";
    signature.textContent = "@ Powered by Proveway";
    footer.appendChild(signature);

    section.appendChild(footer);

    document.body.appendChild(section);
}