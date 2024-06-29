## Project Overview

The task involves developing a web application that allows users to browse through a list of products categorized by various parameters. Users should have the capability to sort and filter products based on criteria such as categories, price range, gender, occasion, and discount. Furthermore, the application should empower users to seamlessly edit and delete their selected products, with these modifications being promptly reflected in the user interface.


### Setting Up the Project

To set up the project locally, follow these steps:

1. Clone the repository and navigate to the project folder.
2. Import the product_database.sql file in to your MySQL database (you can use phpMyAdmin).
3. Update the .env file with your own MySQL credentials.
4. Run `npm install --force`.
5. Start the project using `npm run dev`.
6. Access the NextJS website at http://localhost:3000.
7. Setup the database, You would need mysql and workbench for the database. You can get it from here: https://dev.mysql.com/downloads/installer. To Import data in do refer to this document: https://dev.mysql.com/doc/workbench/en/wb-admin-export-import-management.html

### Features Implemented

1. Pagination for products.
2. Product Sorting.
3. Filters (Brand, Category, Price, Occasion, Discount).
4. **URL Parameters**: Store all filter and sort options in the URL parameters to replicate the user's browsing state when sharing URLs.

#### Product Operations (Create/Edit/Delete)

10. **Create Product**: Allow users to crete product.
11. **Edit Product**: Allow users to modify specific product details.
12. **Delete Product**: Provide the functionality to remove a particular product from the list.
