// GLOBAL VARIABLE

// DOM element
let inputBtn = document.getElementById("submitBtn");
let modal = document.getElementById("myModal");
let displayArea = document.getElementById("displayArea");
let searchBar = document.getElementById("search");
// url regex (validation.url())
let urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
// change target variable (handler.listEvent() -> change btn event | handler.changeSubmit())
let changeTarget = "";
// sort data (DOM)
let sortData = {
  sortBy: "",
  ascending: ""
}



/***************************************************************************************/
// DATA HANDLER
let data = {
  // BOOKS DATA
  // get books list
  getItem: function() {
    return JSON.parse(localStorage.getItem("bookList"))
  },

  // set books list
  setItem: function(bookList) {
    localStorage.setItem("bookList", JSON.stringify(bookList))
  },

  // add book
  addItem: function(title, author, url) {
    // check if the input title is already have / no input title
    if (validation.title(title) && validation.url(url)) {
      // get newBook, oldBook, create the new bookList
      let newBook = {title: title, author: author, url: url, star: 0, pages: 0, status: "reading"}



      let oldBookList = this.getItem()
      let booksList = [];
      // check the oldBookList to change new bookList
      if (!oldBookList) {
        booksList.push(newBook);
      } else {
        oldBookList.push(newBook);
        booksList = oldBookList.slice();
      }
      // set new bookList to localStorage
      this.setItem(booksList)
    }
  },

  // remove a book
  removeItem: function(bookTitle) {
    // get booklist
    let booksList = this.getItem();
    // loop -> find match -> remove; not found -> alert
    let i=0;
    let l= booksList.length;
    for (i; i<l; i++) {
      if (booksList[i].title.toLowerCase() === bookTitle.toLowerCase()) {
        booksList.splice(i, 1)
        // set booklist to localStorage
        this.setItem(booksList)
        return true
      }
    };
    alert("bookTitle not found");
    return false
  },

  // remove all books
  removeAll: function() {
    localStorage.removeItem("bookList")
  },

  // change a book's info
  changeItem: function(bookTitle, book, author, url) {
    // get booklist
    let booksList = this.getItem();
    // loop -> find match -> remove; not found -> alert
    let i=0;
    let l= booksList.length;
    for (i; i<l; i++) {
      if (booksList[i].title.toLowerCase() === bookTitle.toLowerCase()) {
        booksList[i] = {
          title: book,
          author: author,
          url: url,
          star: booksList[i].star,
          pages: booksList[i].pages,
          status: booksList[i].status,
        }
        // set booklist to localStorage
        this.setItem(booksList)
        return true
      }
    };
    alert("bookTitle not found");
    return false
  },

  // change star rating
  changeRating: function(bookTitle, star) {
    // get booklist
    let booksList = this.getItem();
    // loop -> find match -> remove; not found -> alert
    let i=0;
    let l= booksList.length;
    for (i; i<l; i++) {
      if (booksList[i].title.toLowerCase() === bookTitle.toLowerCase()) {
        booksList[i] = {
          title: booksList[i].title,
          author: booksList[i].author,
          url: booksList[i].url,
          star: star,
          pages: booksList[i].pages,
          status: booksList[i].status,
        }
        // set booklist to localStorage
        this.setItem(booksList)
        return true
      }
    };
    alert("bookTitle not found");
    return false
  },

  // change status rating
  changeStatus: function(bookTitle, status) {
    // get booklist
    let booksList = this.getItem();
    // loop -> find match -> remove; not found -> alert
    let i=0;
    let l= booksList.length;
    for (i; i<l; i++) {
      if (booksList[i].title.toLowerCase() === bookTitle.toLowerCase()) {
        booksList[i] = {
          title: booksList[i].title,
          author: booksList[i].author,
          url: booksList[i].url,
          star: booksList[i].star,
          pages: booksList[i].pages,
          status: status,
        }
        // set booklist to localStorage
        this.setItem(booksList)
        return true
      }
    };
    alert("bookTitle not found");
    return false
  },

  // change pages rating
  changePages: function(bookTitle, pages) {
    // get booklist
    let booksList = this.getItem();
    // loop -> find match -> remove; not found -> alert
    let i=0;
    let l= booksList.length;
    for (i; i<l; i++) {
      if (booksList[i].title.toLowerCase() === bookTitle.toLowerCase()) {
        booksList[i] = {
          title: booksList[i].title,
          author: booksList[i].author,
          url: booksList[i].url,
          star: booksList[i].star,
          pages: pages,
          status: booksList[i].status,
        }
        // set booklist to localStorage
        this.setItem(booksList)
        return true
      }
    };
    alert("bookTitle not found");
    return false
  },

  // SORT DATA
  // change sort
  sortBooksList: function() {
    // get gata from localStorage
    let booksList = this.getItem();
    // if no sort data -> set default
    if (sortData.sortBy == "" | sortData.scending == "") {
      return booksList
    }
    // get attribute from sort datas
    let {sortBy, ascending} = sortData
    //sort books list
    if (ascending == "true") {
      // case 1: ascending
      booksList.sort(function(a, b) {
        if (typeof a[sortBy] == "string") {
          // if string
          return a[sortBy].toLowerCase() === b[sortBy].toLowerCase() ? 0 : a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1;
        } else {
          // if number
          return a[sortBy] - b[sortBy]
        }
      })
    } else {
      // case 2: descending
      booksList.sort(function(a, b) {
        if (typeof a[sortBy] == "string") {
          // if string
          return a[sortBy].toLowerCase() === b[sortBy].toLowerCase() ? 0 : a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? -1 : 1;
        } else {
          // if number
          return b[sortBy] - a[sortBy]
        }
      })
    }
    // return sorted array
    return booksList
  }
}

/***************************************************************************************/
// INPUT VALIDATION
let validation = {
  // title validation
  title: function(title) {
    let booksList = data.getItem();
    // case 1: title don't contain num or words -> false
    if (!(/\w/ig).test(title)) {
      alert("Title invalid")
      return false
    };
    // case 2: title valid + localStorage don't have any book -> don't find match -> true
    if (booksList == null) {
      return true
    };
    // case 3: title valid + match with current books -> false
    if (booksList.some(book => book.title.toLowerCase() === title.toLowerCase())) {
      alert("Already have this title")
      return false
    } else {
      // case 4: title valid + don't match with current books -> true
      return true
    }
  },
  // url validation
  url: function(url) {
    // case 1: book don't have any url
    if (url == "#") {
      return true;
    } else
    // case 2: url valid
    if (urlRegex.test(url)) {
      return true;
    } else {
    // case 3: url invalid
      console.log(url)
      alert("URL invalid");
      return false;
    }
  }
}

/***************************************************************************************/
// EVENT HANDLER
let handler = {
  // NEW BOOK SUBMIT
  submit: function(e) {
    e.preventDefault();
    // get input value
    let title = document.getElementById("titleInput").value;
    let author = document.getElementById("authorInput").value;
    let url = document.getElementById("urlInput").value;
    // set default URL = #
    if (url == "") {
      url ="#"
    }
    // add book to localStorage
    data.addItem(title, author, url)
    // clear input area
    document.getElementById("titleInput").value = "";    document.getElementById("authorInput").value = "";
    document.getElementById("urlInput").value = "";
    // re-fetch display
    display();
  },
  // BOOKS LIST EVENT HANDLER (DELETE, CHANGE BUTTON, RATING)
  listEvent: function(e) {
    let classList = Array.from(e.target.classList);

    // HANDLE DELETE
    if (classList.includes("fa-trash")) {
      if (confirm("Do you want to delete this book?")) {
        // get book title from target
        let bookTitle = e.target.parentNode.parentNode.parentNode.parentNode.children[1].children[0].textContent;
        // remove item
        data.removeItem(bookTitle)
        // re-fetch book list
        display()
      }
    } else

    // HANDLE CHANGE BOOK
    if (classList.includes("fa-pencil-alt")) {
      // set changeTarget title
      changeTarget =  e.target.parentNode.parentNode.parentNode.parentNode.children[1].children[0].textContent;
      // set change modal title
      document.getElementById('modal-title').textContent = "Change " + changeTarget;
      // set change book default value
      let booksList = data.getItem();
      for (let i=0; i<booksList.length; i++) {
        if (booksList[i].title.toLowerCase() === changeTarget.toLowerCase()) {
          document.getElementById('change-title').value = booksList[i].title;
          document.getElementById('change-author').value = booksList[i].author;
          document.getElementById('change-url').value = booksList[i].url;
        }
      }
    } else

    // HANDLE CHANGE RATING
    if (classList.includes("fa-star")) {
      // get target title
      let changeRatingTarget = e.target.parentNode.parentNode.parentNode.children[1].children[0].textContent;
      // get rating from target class
      let newRating = 0;
      if (classList.includes("star1")) {
        newRating = 1;
      } else
      if (classList.includes("star2")) {
        newRating = 2;
      } else
      if (classList.includes("star3")) {
        newRating = 3;
      } else
      if (classList.includes("star4")) {
        newRating = 4;
      } else
      if (classList.includes("star5")) {
        newRating = 5;
      };
      // change rating
      data.changeRating(changeRatingTarget, newRating);
      // re-fetch display
      display();
    }
  },
  // HANDLE CHANGE MODAL SUBMIT BUTTON
  changeSubmit: function() {
    // get changes input
    let changeTitle = document.getElementById('change-title').value;
    let changeAuthor = document.getElementById('change-author').value;
    let changeUrl = document.getElementById('change-url').value;
    // data validation
    // URL validation
    if (validation.url(changeUrl)) {
      // title valitation: don't change title || change to valid title
      if (changeTitle === changeTarget || validation.title(changeTitle)) {
        // case 1: valid
        // change selected item
        data.changeItem(changeTarget, changeTitle, changeAuthor, changeUrl);
        // re-fetch display
        display();
      }
    }
  },
  // HANDLE PAGES CHANGE
  pagesChange: function(e) {
    // get element from event
    let target = e.target.parentNode.parentNode.children[1].children[0].textContent;
    let changeValue = Number(e.srcElement.value);
    // change localStorage data (don't need to re-fetch display)
    data.changePages(target, changeValue)
  },
  // HANDLE STATUS CHANGE
  statusChange: function(e) {
    // get element from event
    let target = e.target.parentNode.parentNode.children[1].children[0].textContent;
    let changeValue = e.srcElement.value;
    // change localStorage data (don't need to re-fetch display)
    data.changeStatus(target, changeValue)
  },
  // HANDLE SORT BUTTON
  sort: function() {
    // get sort value
    let sortBy = document.getElementById("sort-by").value;
    let order = document.getElementById("sort-order").value;
    // check sort value
    if (sortBy == "") {
      alert("Please choose sort by!");
      return false;
    };
    if (order == "") {
      alert("Please choose order!");
      return false;
    };
    // change sort data
    sortData = {
      sortBy: sortBy,
      ascending: order
    };
    // re-fetch display
    display();
  },
  // HANDLE SEARCH
  search: function() {
    // get search value, books display list
    let searchValue = searchBar.value.toLowerCase();
    let booksList = document.getElementsByClassName("card");
    // add searching indicate
    if (searchValue != "") {
      document.getElementById("searching").textContent = "Search result:"
    } else {
      document.getElementById("searching").textContent = ""
    }
    // loop -> match: display | not match: none
    Array.from(booksList).map(item => {
        if ((item.children[0].children[1].children[0].textContent.toLowerCase()).indexOf(searchValue) != -1) {
          item.style.display = "block"
        } else {
          item.style.display = "none"
        }
      }
    )

    console.log(searchValue);
  }
}

/***************************************************************************************/
// DISPLAY HANDLER
let display = function() {
    // reset displayArea
    displayArea.innerHTML = "";
    // get bookslist from localStorage
    let booksList = data.sortBooksList();
    // check if no booksList
    if (booksList != null) {
      // loop through list of book
      for (let i = 0; i < booksList.length; i++) {
        // CREATE DISPLAY CARD
        let divCard = document.createElement("div");
        divCard.className = "card bg-light book py-2";

        // SET TARGET'S STYLES
        // set hidden status for URL button
        let hidden = '';
        if (booksList[i].url == "#") {
          hidden = 'style="display: none"'
        }
        // set selected status for select input
        let readingSelect = "";
        let completedSelect = "";
        let dropSelect = "";
        switch(booksList[i].status) {
          case "drop":
            dropSelect = "selected";
            break;
          case "completed":
            completedSelect = "selected";
            break;
          default:
            readingSelect = "selected";
        }
        // set star rating style
        let starStyle1 = "display: block";
        let starStyle2 = "display: block";
        let starStyle3 = "display: block";
        let starStyle4 = "display: block";
        let starStyle5 = "display: block";
        switch(booksList[i].star) {
          case 1:
            starStyle1 = "display: block; color: orange";
            break;
          case 2:
            starStyle1 = "display: block; color: orange";
            starStyle2 = "display: block; color: orange";
            break;
          case 3:
            starStyle1 = "display: block; color: orange";
            starStyle2 = "display: block; color: orange";
            starStyle3 = "display: block; color: orange";
            break;
          case 4:
            starStyle1 = "display: block; color: orange";
            starStyle2 = "display: block; color: orange";
            starStyle3 = "display: block; color: orange";
            starStyle4 = "display: block; color: orange";
            break;
          case 5:
            starStyle1 = "display: block; color: orange";
            starStyle2 = "display: block; color: orange";
            starStyle3 = "display: block; color: orange";
            starStyle4 = "display: block; color: orange";
            starStyle5 = "display: block; color: orange";
            break;
        }

        // ADD INNER HTML + TARGET STYLES
        divCard.innerHTML +=
        '<div class="row">'+
          '<div class="col-md-2 col-2">'+
            '<div class="row stars text-secondary pl-md-5 pl-4 pt-3">'+
              '<i class="fas fa-star star1" style="'+ starStyle1 +'"></i>'+
              '<i class="fas fa-star star2" style="'+ starStyle2 +'"></i>'+
              '<i class="fas fa-star star3" style="'+ starStyle3 +'"></i>'+
              '<i class="fas fa-star star4" style="'+ starStyle4 +'"></i>'+
              '<i class="fas fa-star star5" style="'+ starStyle5 +'"></i>'+
            '</div> '+
          '</div> '+
          '<div class="col-md-4 col-3"> '+
            '<h3 class="font-weight-normal title">'+booksList[i].title+'</h3>'+
            '<p class="author">'+booksList[i].author+'</p>'+
          '</div> '+
          '<div class="col-md-2 col-3"> '+
            '<input type="number" value='+ booksList[i].pages +' class="form-control pages" min=0 > '+
          '</div> '+
          '<div class="col-md-2 col-2"> '+
            '<select class="status form-control" > '+
              '<option '+ readingSelect +' value="reading">Reading</option> '+
              '<option '+ completedSelect +' value="completed">Completed</option> '+
              '<option '+ dropSelect +' value="drop">Drop</option> '+
            '</select> '+
          '</div> '+
          '<div class="col-md-2 col-2"> '+
            '<div>'+
              '<button '+
                'type="button" '+
                'title="Delete" '+
                'class="btn btn-danger p-0 detete" '+
              '><i class="fas fa-trash p-2" style="display: block"></i></button>'+
              '<button '+
                'type="button" '+
                'title="Change" '+
                'class="btn btn-dark p-0 change" '+
                'data-toggle="modal" '+
                'data-target="#myModal" '+
              '><i class="fas fa-pencil-alt p-2" style="display: block"></i></button> '+
              '<button '+
                'type="button" '+
                'title="Visit" ' +
                'class="btn btn-primary p-0 visit" ' +
                hidden +
              '><a href="'+ booksList[i].url +'" target="_blank" style="text-decoration: none; color: white"><i class="fas fa-location-arrow p-2" style="display: block"></i></a></button> '+
            '</div>'+
          '</div>'+
        '</div>';
        // append to displayArea
        displayArea.appendChild(divCard);
        // add Event Listener
        Array.from(document.getElementsByClassName("pages")).map(n => n.addEventListener("change", handler.pagesChange));
        Array.from(document.getElementsByClassName("status")).map(n => n.addEventListener("change", handler.statusChange));
        // re-fetch search
        if (searchBar.value != "") {handler.search()}
      }
    } else {
      console.log("No Item")
    }
  }

/***************************************************************************************/
// EVENT LISTENER
// submit event
inputBtn.addEventListener("click", handler.submit);
// display area's delete, change, rating events
displayArea.addEventListener("click", handler.listEvent);
// change modal event
document.getElementById("change-submit").addEventListener("click", handler.changeSubmit);
// sort event
document.getElementById("sort-btn").addEventListener("click", handler.sort)
// search event
searchBar.addEventListener("keyup", handler.search)
