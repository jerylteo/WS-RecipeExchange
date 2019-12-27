new Vue({
    el: '#app',
    data: {
        recipe: {
            name: '',
            category: '',
            description: '',
            author: '',
            image: null,
        },
        recipes: null,
        editStatus: false,
        imgsrc: GET_IMAGE_URL,
    },
    methods: {
        initialise() {
            this.getAllRecipes();
        },
        getAllRecipes() {
            axios.get(GET_RECIPES_URL)
            .then(response=> {
                this.recipes = response.data;
                console.log(this.recipes);
            })
            .catch(error=>{
                console.log(error);
            })
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
        edit(id) {
            this.editStatus = true;
            this.getRecipe(`${GET_RECIPES_ID_URL}${id}/edit`);
        },
        update(id) {
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
        }
    },
    mounted() {
        this.initialise();
    },
    
});