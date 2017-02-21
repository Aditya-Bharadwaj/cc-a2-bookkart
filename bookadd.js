var db;
var catdb;
function dbAccess()
{
	db = new PouchDB('https://d1539068-0ce6-4628-ac7f-3b5c52df2f67-bluemix:b6ebb29a274e801a8544659a4d20634b3bbb252fbf44ebe7b427a19f53f8c6b4@d1539068-0ce6-4628-ac7f-3b5c52df2f67-bluemix.cloudant.com');
	catdb = new PouchDB('https://d1539068-0ce6-4628-ac7f-3b5c52df2f67-bluemix:b6ebb29a274e801a8544659a4d20634b3bbb252fbf44ebe7b427a19f53f8c6b4@d1539068-0ce6-4628-ac7f-3b5c52df2f67-bluemix.cloudant.com/categories');
}
function addBook()
{
	var category = document.getElementById("categories").value;
	var title = document.getElementById("title").value;
	var isbn = document.getElementById("isbn").value;
	var author = document.getElementById("author").value;
	var description = document.getElementById("description").value;
	var copies = document.getElementById("copies").value;
	var price = document.getElementById("price").value;
	db.get('books').then(function(){
		db.post({
			"category":category,
			"title": title,
			"_id":isbn,
			"author": author,
			"description": description,
			"copies": copies,
			"price": price
			
		}).then(function (response){ 
			console.log(response);
		}).catch(function(err) {
			console.log(err);
		});
	});
	
	
}
function getBooks()
{
	query = {
  	"selector": {
    	"_id": {
      	"$gt": -1
  		}
  	}
	};
	db.find(query).then(function (result) {
		console.log(result.docs);
		showBooks(result.docs);
	}).catch(function (err) {
			console.log(err);
	});
}

function addToSelect(arr)
{
	var categories = document.getElementById("categories");
	for(var i = 0; i < arr.length; i++)
	{
		categories.options[i] = new Option(arr[i].category_title);
	}
}

function showBooks(arr)
{
	var tbody = document.getElementById('tbody');
	tbody.innerHTML = "";
	var tr;
	var td;
	var th;
	var delBtn;
	var curr_id;
	
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].copies > 0)
		{
			tr = document.createElement('tr');	
			td = document.createElement('td');
			td.innerHTML = arr[i].category;
			tr.appendChild(td);
			td = document.createElement('td');
			td.innerHTML = arr[i].title;
			tr.appendChild(td);
			td = document.createElement('td');
			td.innerHTML = arr[i]._id;
			tr.appendChild(td);
			td = document.createElement('td');
			td.innerHTML = arr[i].author;
			tr.appendChild(td);
			td = document.createElement('td');
			td.innerHTML = arr[i].description;
			tr.appendChild(td);
			td = document.createElement('td');
			td.innerHTML = arr[i].copies;
			tr.appendChild(td);
			td = document.createElement('td');
			td.innerHTML = arr[i].price;
			tr.appendChild(td);

			td = document.createElement('td');
			delBtn = document.createElement('button');
			delBtn.id = arr[i]._id;
			curr_id = arr[i]._id;
			delBtn.onclick = function(event) {
				removeBook(event.target.id);
				getBooks();
			};
			delBtn.innerHTML = 'Delete';
			td.appendChild(delBtn);		
			tr.appendChild(td);

			td = document.createElement('td');
			chngBtn = document.createElement('button');
			chngBtn.id = arr[i]._id;
			curr_id = arr[i]._id;
			chngBtn.onclick = function(event) {
				repriceBook(event.target.id);
				getBooks();
			};
			chngBtn.innerHTML = 'Change Price';
			td.appendChild(chngBtn);		
			tr.appendChild(td);

			td = document.createElement('td');
			buyBtn = document.createElement('button');
			buyBtn.id = arr[i]._id;
			curr_id = arr[i]._id;
			buyBtn.onclick = function(event) {
				buyBook(event.target.id);
				getBooks();
			};
			buyBtn.innerHTML = 'Buy one copy';
			td.appendChild(buyBtn);		
			tr.appendChild(td);

			tbody.appendChild(tr);
		}
		else
		{
			removeBook(arr[i]._id);
		}
	}
}

function buyBook(bookID)
{

	query = {
  	"selector": {
    	"_id": {
      	"$eq": String(bookID)
  		}
  	}
	};
	console.log(query);
	db.find(query).then(function (result) {
		for (var i = 0; i < result.docs.length; i++) {
			result.docs[i].copies = result.docs[i].copies-1;
		}
		console.log(result);
		db.bulkDocs(result.docs);
	}).catch(function (err) {
			console.log(err);
		});	
	
	getBooks();
}

function repriceBook(bookID)
{
	query = {
  	"selector": {
    	"_id": {
      	"$eq": String(bookID)
  		}
  	}
	};
	console.log(query);
	db.find(query).then(function (result) {
		for (var i = 0; i < result.docs.length; i++) {
			result.docs[i].price = prompt("Enter a new price: ");
		}
		console.log(result);
		db.bulkDocs(result.docs);
	}).catch(function (err) {
			console.log(err);
		});	
	
	getBooks();
}

function removeBook(bookID)
{
	query = {
  	"selector": {
    	"_id": {
      	"$eq": String(bookID)
  		}
  	}
	};
	console.log(query);
	db.find(query).then(function (result) {
		for (var i = 0; i < result.docs.length; i++) {
			result.docs[i]._id = -1;
		}
		console.log(result);
		db.bulkDocs(result.docs);
	}).catch(function (err) {
			console.log(err);
		});	
	db.find(query).then(function (result) {
		console.log(result);		
			result.docs[0]._deleted = true;
			db.put(result.docs[0]);		
	}).catch(function (err) {

		console.log(err);
	});
	getBooks();
}

function getCategories()
{
	query = {
  	"selector": {
    	"category_id": {
      	"$gt": -1
	  		}
	  	}
	};
	db.get('categories').then(function(){
	console.log(query);
	catdb.find(query).then(function (result){
		console.log(result.docs);
		addToSelect(result.docs);
	}).catch(function (err){
		console.log(err);
	});
	});
}
