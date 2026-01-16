var app = angular.module('publicApp', ['ngRoute']);

// Configure routes
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/categories', {
            templateUrl: 'views/categories.html',
            controller: 'CategoriesController'
        })
        .when('/about', {
            templateUrl: 'views/about.html'
        })
        .when('/contact', {
            templateUrl: 'views/contact.html',
            controller: 'ContactController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })
        .when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileController'
        })
        .when('/products/:categoryId', {
            templateUrl: 'views/products.html',
            controller: 'ProductsController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

// Configure HTTP for Django CSRF
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);

// Main Controller
app.controller('MainController', function ($scope, $location) {
    $scope.isLoggedIn = false;
    $scope.currentUser = null;

    // Check if user is logged in
    $scope.checkLogin = function () {
        var user = localStorage.getItem('currentUser');
        if (user) {
            $scope.currentUser = JSON.parse(user);
            $scope.isLoggedIn = true;
        }
    };

    // Logout function
    $scope.logout = function () {
        localStorage.removeItem('currentUser');
        $scope.isLoggedIn = false;
        $scope.currentUser = null;
        $location.path('/');
    };

    $scope.checkLogin();

    // Watch for login changes
    $scope.$on('userLoggedIn', function (event, user) {
        $scope.currentUser = user;
        $scope.isLoggedIn = true;
    });
});

// Home Controller
app.controller('HomeController', function ($scope, $location) {

    $scope.featuredCategories = [
        {
            id: 1,
            name: 'Living Room',
            icon: 'fa-couch',
            description: 'Premium furniture for every room',
            color: '#4A90E2'
        },
        {
            id: 2,
            name: 'Kitchenware',
            icon: 'fa-blender',
            description: 'Modern home appliances',
            color: '#E94B3C'
        },
        {
            id: 3,
            name: 'Transport',
            icon: 'fa-truck',
            description: 'Latest electronics and gadgets',
            color: '#50C878'
        },
        {
            id: 4,
            name: 'Others',
            icon: 'fa-dumbbell',
            description: 'Home gym equipment',
            color: '#F39C12'
        }
    ];

    $scope.features = [
        {
            icon: 'fa-truck',
            title: 'Free Delivery',
            description: 'We deliver and install for free'
        },
        {
            icon: 'fa-tools',
            title: 'Free Maintenance',
            description: '24/7 maintenance support included'
        },
        {
            icon: 'fa-exchange-alt',
            title: 'Easy Exchange',
            description: 'Upgrade or exchange anytime'
        },
        {
            icon: 'fa-shield-alt',
            title: 'Secure & Safe',
            description: 'All products are sanitized'
        }
    ];

    // ✅ ADD THIS FUNCTION
    $scope.goToProducts = function (categoryId) {
        $location.path('/products/' + categoryId);
    };
});

// Categories Controller
app.controller('CategoriesController', function($scope, $http) {
    const API_URL = 'http://127.0.0.1:8000/category/';
    
    $scope.categories = [];
    $scope.loading = true;

    $scope.loadCategories = function() {
        $http.get(API_URL)
            .then(function(response) {
                $scope.categories = response.data;
                $scope.loading = false;
            })
            .catch(function(error) {
                console.error('Error loading categories:', error);
                $scope.loading = false;
                // Fallback demo data
                $scope.categories = [
                    { id: 1, name: 'Living Room Furniture', description: 'Sofas, tables, and more' },
                    { id: 2, name: 'Bedroom Furniture', description: 'Beds, wardrobes, and storage' },
                    { id: 3, name: 'Kitchen Appliances', description: 'Refrigerators, microwaves, and more' },
                    { id: 4, name: 'Electronics', description: 'TVs, laptops, and gadgets' },
                    { id: 5, name: 'Fitness Equipment', description: 'Treadmills, bikes, and weights' },
                    { id: 6, name: 'Home Decor', description: 'Lights, paintings, and accessories' }
                ];
            });
    };

    $scope.loadCategories();
});

// Contact Controller
app.controller('ContactController', function($scope) {
    $scope.contact = {};
    $scope.submitted = false;

    $scope.submitContact = function() {
        if ($scope.contactForm.$valid) {
            // Here you would normally send to backend
            console.log('Contact form submitted:', $scope.contact);
            $scope.submitted = true;
            $scope.contact = {};
            $scope.contactForm.$setPristine();
            
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.submitted = false;
                });
            }, 3000);
        }
    };
});

// Login Controller
app.controller('LoginController', function($scope, $http, $location, $rootScope) {
    $scope.credentials = {};
    $scope.errorMessage = '';
    $scope.loading = false;

    const LOGIN_API = 'http://127.0.0.1:8000/customer/login/';

    $scope.login = function() {
        if ($scope.loginForm.$valid) {
            $scope.loading = true;
            $scope.errorMessage = '';

            $http.post(LOGIN_API, $scope.credentials)
                .then(function(response) {
                    var userData = {
                        id: response.data.customer_id,
                        name: response.data.name,
                        email: $scope.credentials.email
                    };
                    
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    $rootScope.$broadcast('userLoggedIn', userData);
                    
                    $location.path('/');
                })
                .catch(function(error) {
                    $scope.loading = false;
                    if (error.data && error.data.error) {
                        $scope.errorMessage = error.data.error;
                    } else {
                        $scope.errorMessage = 'Login failed. Please try again.';
                    }
                });
        }
    };
});

// Register Controller
app.controller('RegisterController', function($scope, $http, $location) {
    $scope.customer = {};
    $scope.errorMessage = '';
    $scope.loading = false;

    const REGISTER_API = 'http://127.0.0.1:8000/customer/';

    $scope.register = function() {
        if ($scope.registerForm.$valid) {
            if ($scope.customer.password !== $scope.customer.confirmPassword) {
                $scope.errorMessage = 'Passwords do not match!';
                return;
            }

            $scope.loading = true;
            $scope.errorMessage = '';

            // Remove confirmPassword before sending
            var customerData = angular.copy($scope.customer);
            delete customerData.confirmPassword;

            $http.post(REGISTER_API, customerData)
                .then(function(response) {
                    alert('Registration successful! Please login.');
                    $location.path('/login');
                })
                .catch(function(error) {
                    $scope.loading = false;
                    if (error.data && error.data.email) {
                        $scope.errorMessage = 'Email already exists!';
                    } else if (error.data) {
                        $scope.errorMessage = JSON.stringify(error.data);
                    } else {
                        $scope.errorMessage = 'Registration failed. Please try again.';
                    }
                });
        }
    };
});

// Profile Controller
app.controller('ProfileController', function($scope, $http, $location) {
    $scope.customer = {};
    $scope.isEditing = false;
    $scope.successMessage = '';
    $scope.errorMessage = '';

    var userData = localStorage.getItem('currentUser');
    if (!userData) {
        $location.path('/login');
        return;
    }

    var user = JSON.parse(userData);
    const CUSTOMER_API = 'http://127.0.0.1:8000/customer/' + user.id + '/';

    // Load customer data
    $scope.loadProfile = function() {
        $http.get(CUSTOMER_API)
            .then(function(response) {
                $scope.customer = response.data;
                $scope.originalCustomer = angular.copy(response.data);
            })
            .catch(function(error) {
                console.error('Error loading profile:', error);
            });
    };

    $scope.toggleEdit = function() {
        $scope.isEditing = !$scope.isEditing;
        if (!$scope.isEditing) {
            $scope.customer = angular.copy($scope.originalCustomer);
        }
    };

    $scope.updateProfile = function() {
        $scope.errorMessage = '';
        $scope.successMessage = '';

        $http.put(CUSTOMER_API, $scope.customer)
            .then(function(response) {
                $scope.successMessage = 'Profile updated successfully!';
                $scope.isEditing = false;
                $scope.originalCustomer = angular.copy(response.data);
                
                // Update localStorage
                var userData = JSON.parse(localStorage.getItem('currentUser'));
                userData.name = response.data.name;
                localStorage.setItem('currentUser', JSON.stringify(userData));
            })
            .catch(function(error) {
                $scope.errorMessage = 'Failed to update profile. Please try again.';
            });
    };

    $scope.loadProfile();
});

app.controller('ProductsController', function ($scope, $http, $routeParams) {

    const categoryId = $routeParams.categoryId;
    const API_URL = `http://127.0.0.1:8000/product/?category=${categoryId}`;

    $scope.products = [];
    $scope.loading = true;

    $http.get(API_URL)
        .then(function (response) {
            $scope.products = response.data;
            $scope.loading = false;
        })
        .catch(function (error) {
            console.error(error);
            $scope.loading = false;
        });
});
