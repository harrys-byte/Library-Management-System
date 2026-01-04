document.addEventListener("DOMContentLoaded", () => {
    showBooks();
    showCart();
});

function addBook() {
    let title = document.getElementById("title").value.trim();
    let author = document.getElementById("author").value.trim();
    let isbn = document.getElementById("isbn").value.trim();
    let price = document.getElementById("price").value.trim();
    let count = document.getElementById("count").value.trim(); // New: Get stock count

    if (!title || !author || !isbn || !price || !count) {
        alert("Please fill all fields!");
        return;
    }

    let books = JSON.parse(localStorage.getItem("books")) || [];

    // Check if book with the same ISBN already exists
    let existingBook = books.find(book => book.isbn === isbn);
    if (existingBook) {
        existingBook.count += parseInt(count); // Increase stock if exists
    } else {
        books.push({ 
            title, 
            author, 
            isbn, 
            price: parseFloat(price), 
            count: parseInt(count)  // Store stock count
        });
    }

    localStorage.setItem("books", JSON.stringify(books));

    showBooks(); 
    clearFields();
}


function showBooks() {
    const tbody = document.querySelector("#book-table tbody");
    tbody.innerHTML = "";

    document.getElementById("book-count").textContent = `Total Books: ${bookList.length}`;

    bookList.forEach((book, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>${book.price}</td>
                <td>${book.genre}</td>
                <td>${book.count}</td> <!-- Display stock count -->
                <td>
                    <button onclick="addToCart(${index})">🛒 Add to Cart</button>
                </td>
            </tr>
        `;
    });
}

function addToCart(index) {
    const bookToAdd = filteredBooks[index];

    if (bookToAdd.count > 0) {
        bookToAdd.count--;
        cart.push(bookToAdd);
        localStorage.setItem("cart", JSON.stringify(cart));
        showBooks(filteredBooks); // Update table
        showCart();
    } else {
        alert("Out of stock!");
    }
    showCart();
}

function showCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartTable = document.getElementById("cartTable");
    cartTable.innerHTML = "";

    cart.forEach((book, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>₹${book.price.toFixed(2)}</td>
            <td><button onclick="removeFromCart(${index})" class="btn btn-danger">❌ Remove</button></td>
        `;
        cartTable.appendChild(row);
    });
}

function removeFromCart(index) {
    const removedBook = cart[index];
    
    const bookInStock = books.find(book => book.isbn === removedBook.isbn);
    if (bookInStock) {
        bookInStock.count++;  
    }

    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    showBooks(filteredBooks);
    showCart();
}

function checkout() {
    if (confirm("Proceed to checkout?")) {
        window.location.href = "checkout.html";
    }
}

function deleteBook(index) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    showBooks();
}

function exportCSV() {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let csvContent = "Title,Author,ISBN,Price\n";

    books.forEach(book => {
        csvContent += `${book.title},${book.author},${book.isbn},${book.price}\n`;
    });

    let blob = new Blob([csvContent], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "library_books.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function storeTransaction(username, title, author, isbn, price, genre) {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    let newTransaction = {
        username: username || "Guest",
        title,
        author,
        isbn,
        price,
        genre,
        date: new Date().toLocaleString()
    };
    
    transactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}
