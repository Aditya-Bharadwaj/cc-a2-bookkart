var db = new PouchDB('https://d1539068-0ce6-4628-ac7f-3b5c52df2f67-bluemix:b6ebb29a274e801a8544659a4d20634b3bbb252fbf44ebe7b427a19f53f8c6b4@d1539068-0ce6-4628-ac7f-3b5c52df2f67-bluemix.cloudant.com/bookkart');
var categorydb = new PouchDB('https://d1539068-0ce6-4628-ac7f-3b5c52df2f67-bluemix:b6ebb29a274e801a8544659a4d20634b3bbb252fbf44ebe7b427a19f53f8c6b4@d1539068-0ce6-4628-ac7f-3b5c52df2f67-bluemix.cloudant.com/categories');
var query;
var currCatID;

//var bkTableId=document.getElementById("table1");

function showCategories(catArray) {
	document.getElementById("tbl1").style.display="";
	var tbody = document.getElementById('tbody');
	tbody.innerHTML = "";
	//var catArray = getCategories();
	//console.log(catArray);
	var tr;
	var td;
	var delBtn;
	var curr_id;
	var showBtn;
	for(var i = 0; i < catArray.length; i++) {
		tr = document.createElement('tr');
	
		td = document.createElement('td');
		td.innerHTML = catArray[i].category_title;
		tr.appendChild(td);

		td = document.createElement('td');
		td.innerHTML = catArray[i].category_id;
		tr.appendChild(td);

		td = document.createElement('td');
		delBtn = document.createElement('button');
		delBtn.id = catArray[i].category_id;
		curr_id = catArray[i].category_id;
		delBtn.onclick = function(event) {
			removeCategory(event.target.id);
		};
		delBtn.innerHTML = 'Delete';
		td.appendChild(delBtn);		
		tr.appendChild(td);

		td = document.createElement('td');
		showBtn = document.createElement('button');
		showBtn.id = catArray[i].category_id;
		curr_id = catArray[i].category_id;
		showBtn.onclick = function(event) {
			alert(event.target.id);
			getBooks(event.target.id);
		};
		showBtn.innerHTML = 'Show';
		td.appendChild(showBtn);		
		tr.appendChild(td);

		tbody.appendChild(tr);
	}
}

function getCategories() {
	query = {
  	"selector": {
    	"category_id": {
      	"$gt": -1
  		}
  	}
	};
	categorydb.find(query).then(function (result) {
		//console.log(result.docs);
		showCategories(result.docs);
	}).catch(function (err) {
			console.log(err);
		});
}

function removeCategory(categoryID) {
	query = {
  	"selector": {
    	"category_id": {
      	"$eq": parseInt(categoryID)
  		}
  	}
	};
	console.log(query);
	db.find(query).then(function (result) {
		for (var i = 0; i < result.docs.length; i++) {
			result.docs[i].category_id = -1;
		}
		console.log(result);
		db.bulkDocs(result.docs);
	}).catch(function (err) {
			console.log(err);
		});	
	categorydb.find(query).then(function (result) {
		console.log(result);		
			result.docs[0]._deleted = true;
			categorydb.put(result.docs[0]);		
	}).catch(function (err) {
		console.log(err);
	});
}

function addCategory() {
	categorydb.get('currCatID').then(function(currCatID) {
		//currCatID = JSON.parse(doc);
			categorydb.post({
				category_id: currCatID.value+1,
				category_title: prompt("Enter a new category name: ")
			}).then(function (response) {
				console.log(response);
			}).catch(function (err) {
				console.log(err);
			});
			categorydb.put({
				_id: "currCatID",
				_rev: currCatID._rev,
				value: currCatID.value+1
			});
		
	
	}).catch(function (err) {
		console.log(err);
	});
}
function showBooks(bookArr){
	var tr;
	var td;	
	console.log(bookArr.length);
	for(var i=0;i<bookArr.length;i++){
		tr=document.createElement("tr");

		td=document.createElement("td");
		td.innerHTML=bookArr[i].title;
		tr.appendChild(td);

		td=document.createElement("td");
		td.innerHTML=bookArr[i].desc;
		tr.appendChild(td);

		td=document.createElement("td");
		td.innerHTML=bookArr[i].price;
		tr.appendChild(td);

		tbody1.appendChild(tr);
	}
}
function getBooks(categoryID){
	//var temp=new PouchDB("http://localhost:5984/temp");
	tbody1.innerHTML="";
	document.getElementById("tbl2").style.display="table-row";
	query = {
	  	"selector": {
		    	"category_id": {
		     			"$eq": parseInt(categoryID)
	  			}
	  		},
		};
	var sk=0,i=0;
	db.find(query, function(err,result){
			console.log(Math.floor(result.docs.length/10));
			do{
				query = {
			  	"selector": {
				    	"category_id": {
				     			"$eq": parseInt(categoryID)
			  			}
			  		},
					"limit":10,
					"skip":sk
				};
				sk+=10;
				db.find(query).then(function(result){
					console.log(result.docs);
					showBooks(result.docs);
				}).catch(function (err) {
				console.log(err);
				});
		}
		while(i++<=Math.floor(result.docs.length/10))
	});

}
