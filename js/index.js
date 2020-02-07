const mainVue = new Vue({
    el: '#app',
    data: {
        // router,
        user: {
            loggedIn: false,
            id: null,
            username: null,
            password: null,
            email: null,
            role: null,
        },
        recipe: {
            name: '',
            category: '',
            description: '',
            author: '',
            image: null,
        },
        categories: null,
        search: {
            selCat: null,
            selText: null,
        },
        recipes: null,
        editStatus: false,
        editId: '',
        addStatus: false,
        imgsrc: GET_IMAGE_URL,
        addText: 'ADD NEW RECIPE',
        searchHeading: 'All Recipes'
    },
    watch: {
        addStatus: function(newVal) {
            newVal ? this.addText="CANCEL" : this.addText="ADD NEW RECIPE";
            console.log(this.addStatus);
        }
    },
    methods: {
        initialise() {
            this.getAllRecipes();
            this.getUserDetails();
            this.getCategories();
        },
        getCategories() {
            axios.get(GET_CATEGORIES_URL)
            .then(response=> {
                this.categories = response.data;
                // console.log(this.categories);
            })
        },
        getUserDetails() {
            var details = JSON.parse(sessionStorage.getItem('user'));
            if (details)
                this.user = details;

        },
        getAllRecipes() {
            var searchIndex = sessionStorage.getItem("searchIndex");
            if(searchIndex == null) {
                axios.get(GET_RECIPES_URL)
                .then(response=> {
                    this.recipes = response.data;
                    console.log(this.recipes);
                })
                .catch(error=>{
                    console.log(error);
                })
            } else {
                var temp = JSON.parse(searchIndex);
                this.recipes = temp;
                console.log(this.recipes);
                this.searchHeading = "Searched Recipes";
                sessionStorage.removeItem("searchIndex");
            }
        },
        getRecipe(param) {
            axios.get(param)
            .then(response=>{
                this.recipes = response.data;
                this.recipe.name = response.data[0].name;
                this.recipe.category = response.data[0].category_id;
                this.recipe.description = response.data[0].description;
                this.recipe.author = response.data[0].author;
            })
            .catch(error=>{
                console.log(error);
            })
        },
        update() {
            var id = this.editId;
            var form = new FormData();
            form.append('name', this.recipe.name);
            form.append('description', this.recipe.description);
            form.append('category_id', this.recipe.category);
            form.append('author', this.recipe.author);
            form.append('image', this.recipe.image);

            axios.post(`${PUT_RECIPE_URL}${id}`, form)
            .then(response=>{
                console.log(response.data);
                alert("Update Successful");
                this.editStatus = false;
                this.initialise();
            })
            .catch(error=>{
                console.log(error);
            })
        },
        onImageChange(e) {
            this.recipe.image = e.target.files[0];
        },
        addRecipe() {
            console.log(this.recipe.image);
            var form = new FormData();
            form.append('name', this.recipe.name);
            form.append('description', this.recipe.description);
            form.append('category_id', this.recipe.category);
            form.append('author', this.recipe.author);
            form.append('image', this.recipe.image);

            axios.post(ADD_RECIPE_URL, form)
            .then(response=>{
                console.log(response.data);
                alert("Added Successfully");
                this.initialise();
            })
            .catch(error=>{
                console.log(error);
            })
        },
        removeRecipe(id) {
            var cfm = confirm("Confirm delete?");

            if (cfm) {
                axios.delete(`${DEL_RECIPE_ID_URL}${id}`)
                .then(response=>{
                    console.log(response.data);
                    alert("Delete Successful");
                    this.editStatus = false;
                    this.initialise();
                })
                .catch(error=>{
                    console.log(error);
                })
            }
        },
        editRecipe(recipe) {
            console.log(recipe);
        },
        viewRecipe(rec) {
            console.log(rec);
            var temp = sessionStorage.getItem('rec', JSON.stringify(rec));
            if (temp) {
                sessionStorage.removeItem('rec');
            }
            
            sessionStorage.setItem('rec', JSON.stringify(rec));
            window.location.href = "./recipe.html";
        },
        searchRecipe() {
            // console.log(this.search);
            if (this.search.selCat == null && this.search.selText == null) {
                alert("Please enter search values");
            }
            else {
                if (this.search.selCat != null && this.search.selText == null) {
                    axios.get(`${GET_SEARCH_CAT_URL}${this.search.selCat}`)
                    .then(response=> {
                        console.log(response.data);
                        sessionStorage.setItem("searchIndex", JSON.stringify(response.data));
                        window.location.href = "./recipes.html";
                    })
                    .catch(error=> {
                        console.log(error);
                    })
                }
            }
        },
        catRedirect(cat) {
            this.search.selCat = cat;
            this.searchRecipe();
        }
    },
    mounted() {
        this.initialise();
    },
    
});