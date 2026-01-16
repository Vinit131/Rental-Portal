var app = angular.module("productApp", []);

app.controller("ProductController", function($scope, $http) {
    $scope.products = [];
    $scope.categories = [];
    $scope.newProduct = {};

    // Load all categories for dropdown
    $scope.loadCategories = function() {
        $http.get("http://127.0.0.1:8000/category/").then(function(response){
            $scope.categories = response.data;
        });
    };

    // Load all products
    $scope.loadProducts = function() {
        $http.get("http://127.0.0.1:8000/product/").then(function(response){
            $scope.products = response.data;
        });
    };

    // Add new product
    $scope.addProduct = function() {
        $http.post("http://127.0.0.1:8000/product/", $scope.newProduct).then(function(response){
            $scope.products.push(response.data);
            $scope.newProduct = {};
        }, function(error){
            alert("Error adding product");
        });
    };

    // Edit product
    $scope.editProduct = function(product) {
        product.editing = true;
    };

    // Cancel edit
    $scope.cancelEdit = function(product) {
        product.editing = false;
        $scope.loadProducts();
    };

    // Save product
    $scope.saveProduct = function(product) {
        $http.put("http://127.0.0.1:8000/product/" + product.id + "/", product).then(function(response){
            product.editing = false;
        }, function(error){
            alert("Error updating product");
        });
    };

    // Delete product
    $scope.deleteProduct = function(product) {
        if(confirm("Are you sure you want to delete this product?")){
            $http.delete("http://127.0.0.1:8000/product/" + product.id + "/").then(function(response){
                var index = $scope.products.indexOf(product);
                $scope.products.splice(index, 1);
            }, function(error){
                alert("Error deleting product");
            });
        }
    };

    // Helper: get category name from ID
    $scope.getCategoryName = function(catId){
        var cat = $scope.categories.find(c => c.id === catId);
        return cat ? cat.name : "";
    };

    // Initialize
    $scope.loadCategories();
    $scope.loadProducts();
});
