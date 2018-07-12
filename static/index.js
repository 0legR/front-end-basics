var data = JSON.parse(localStorage.getItem('data'));
if (data === null) {
	function getJSON(callback) {   
		var xml = new XMLHttpRequest();
		xml.overrideMimeType("application/json");
		xml.open('GET', 'http://local.server.next.php.com/static/data.json', true);
		xml.onreadystatechange = function () {
			if (xml.readyState == 4 && xml.status == "200") {
				callback(xml.responseText);
				divideDataToColumns();
			}
		};
		xml.send(null);  
	}

	getJSON(function(response) {
		// localStorage.setItem('data', response);
		data = JSON.parse(response);
		for(var key in data) {
			data[key]['isLeft'] = true;
		}
		localStorage.setItem('data', JSON.stringify(data));
	});	
} else {
	divideDataToColumns();
}

function divideDataToColumns () {
	var leftColumnItemsQuantity = 0;
	var rightColumnItemsQuantity = 0;
	var data = JSON.parse(localStorage.getItem('data'));
	var leftColumn = document.querySelector('.left');
	var rightColumn = document.querySelector('.right');
	for(var key in data) {
		if (data[key].isLeft) {
			dataToColumn(data, key, leftColumn);
			leftColumnItemsQuantity++;
		} else {
			dataToColumn(data, key, rightColumn);
			rightColumnItemsQuantity++;
		}
	}
	setInitialAmountOfItems(leftColumnItemsQuantity, rightColumnItemsQuantity);
	setEventListenerToInput();
}

function dataToColumn (data, key, column, onChange) {
	// create main elements
	var divItem = document.createElement('div');
	divItem.className = 'item';
	divItem.id = key;
	var divPic = document.createElement('div');
	divPic.className = 'pic';
	divTitle = document.createElement('div');
	divTitle.className = 'title';
	divAfter = document.createElement('div');
	divAfter.className = data[key].isLeft ? 'after' : 'before';

// create image element
	var spanImg = document.createElement('span');
	var imgElement = document.createElement('img');
	imgElement.src = data[key].img;
	spanImg.appendChild(imgElement);
	divPic.appendChild(spanImg);

// create title element
	var spanName = document.createElement('span');
	var spanAuthor = document.createElement('span');
	var boldName = document.createElement('b');
	var boldAuthor = document.createElement('b');
	boldName.innerHTML = 'Название&#58;&nbsp;';
	spanName.appendChild(boldName);
	var textName = document.createTextNode(data[key].name);
	spanName.appendChild(textName);
	boldAuthor.innerHTML = 'Автор&#58;&nbsp;';
	spanAuthor.appendChild(boldAuthor);
	var textAuthor = document.createTextNode(data[key].author);
	spanAuthor.appendChild(textAuthor);
	divTitle.appendChild(spanName);
	divTitle.appendChild(spanAuthor);
// add eventListener to after
	var onChange = data[key].isLeft ? changeColumnToRight : changeColumnToLeft;
	divAfter.addEventListener('click', onChange);
	
	divItem.appendChild(divPic);
	divItem.appendChild(divTitle);
	divItem.appendChild(divAfter);

	column.appendChild(divItem);
}

function storeToLocalStorage (itemId, column) {
	var data = JSON.parse(localStorage.getItem('data'));
	var leftColumnItemsQuantity = 0;
	var rightColumnItemsQuantity = 0;
	for(var key in data) {
		if (key === itemId) {
			if (column === 'left') {
				data[key].isLeft = true;
			} else {
				data[key].isLeft = false;
			}
		}
		if (data[key].isLeft) {
			leftColumnItemsQuantity++;
		} else {
			rightColumnItemsQuantity++;
		}
	}
	localStorage.setItem('data', JSON.stringify(data));
	setAmountOfItems(leftColumnItemsQuantity, rightColumnItemsQuantity);
}

function changeColumnToRight (e) {
	var itemElement = e.target.parentNode;
	var rightColumn = document.querySelector('.right');
	var afterElement = e.target;
	afterElement.className = 'before';
	afterElement.removeEventListener('click', changeColumnToRight);
	afterElement.addEventListener('click', changeColumnToLeft);
	rightColumn.appendChild(itemElement);
	storeToLocalStorage(itemElement.id, 'right');

}

function changeColumnToLeft (e) {
	var itemElement = e.target.parentNode;
	var leftColumn = document.querySelector('.left');
	var beforeElement = e.target;
	beforeElement.className = 'after';
	beforeElement.removeEventListener('click', changeColumnToLeft);
	beforeElement.addEventListener('click', changeColumnToRight);
	leftColumn.appendChild(itemElement);
	storeToLocalStorage(itemElement.id, 'left');
}

function setAmountOfItems (leftItemsAmount, rightItemsAmount) {
	var spanRight = document.querySelector('#total_right');
	var spanLeft = document.querySelector('#total_left');
	var boldLeft = document.createElement('b');
	var boldRight = document.createElement('b');
	boldLeft.innerHTML = 'Total&#58;&nbsp;';
	boldRight.innerHTML = 'Total&#58;&nbsp;';
	var textLeft = document.createTextNode(leftItemsAmount);
	var textRight = document.createTextNode(rightItemsAmount);
	spanRight.innerHTML = '';
	spanLeft.innerHTML = '';
	spanRight.appendChild(boldRight);
	spanRight.appendChild(textRight);
	spanLeft.appendChild(boldLeft);
	spanLeft.appendChild(textLeft);
}

function setInitialAmountOfItems (leftItemsAmount, rightItemsAmount) {
	var bodyElement = document.querySelector('body');
	var divCounter = document.createElement('div');
	divCounter.className = 'total';
	var spanRight = document.createElement('span');
	spanRight.id = 'total_right';
	var spanLeft = document.createElement('span');
	spanLeft.id = 'total_left';
	var boldLeft = document.createElement('b');
	var boldRight = document.createElement('b');
	boldLeft.innerHTML = 'Total&#58;&nbsp;';
	boldRight.innerHTML = 'Total&#58;&nbsp;';
	var textLeft = document.createTextNode(leftItemsAmount);
	var textRight = document.createTextNode(rightItemsAmount);
	spanRight.appendChild(boldRight);
	spanRight.appendChild(textRight);
	spanLeft.appendChild(boldLeft);
	spanLeft.appendChild(textLeft);
	divCounter.appendChild(spanLeft);
	divCounter.appendChild(spanRight);
	bodyElement.appendChild(divCounter);
}

function setEventListenerToInput () {
	var inputElement = document.querySelector('input');
	inputElement.addEventListener('input', filterByAuthor);
}

function filterByAuthor (e) {
	var value = e.target.value;
	var data = JSON.parse(localStorage.getItem('data'));
	var filteredData = {};
	for(var key in data) {
		if (data[key].author.toLowerCase().indexOf(value) > -1) {
			filteredData[key] = data[key];
		}
	}

	if (isEmpty(filteredData)) {
		filterIsEmpty();
	} else {
		removeTextEmptyFilter();
		setItemsByFilter(filteredData);
	}
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

function setItemsByFilter (data) {
	var leftColumnItemsQuantity = 0;
	var rightColumnItemsQuantity = 0;
	var leftColumn = document.querySelector('.left');
	leftColumn.innerHTML = '';
	var rightColumn = document.querySelector('.right');
	rightColumn.innerHTML = '';
	for(var key in data) {
		if (data[key].isLeft) {
			dataToColumn(data, key, leftColumn);
			leftColumnItemsQuantity++;
		} else {
			dataToColumn(data, key, rightColumn);
			rightColumnItemsQuantity++;
		}
	}
	setAmountOfItems(leftColumnItemsQuantity, rightColumnItemsQuantity);
}

function filterIsEmpty () {
	var contentElement = document.querySelector('.content').childNodes[1];
	var spanElement = contentElement.childNodes[3];
	if (spanElement !== undefined) {
		contentElement.removeChild(spanElement);
	}
	spanElement = document.createElement('span');
	spanElement.innerHTML = "There is not any appropriated Author";
	spanElement.style.color = 'red';	
	contentElement.appendChild(spanElement);	
}

function removeTextEmptyFilter () {
	var contentElement = document.querySelector('.content').childNodes[1];
	var spanElement = contentElement.childNodes[3];
	if (spanElement !== undefined) {
		contentElement.removeChild(spanElement);
	}	
}
