new Vue({
    el: '#app',
    data: {
        recipes: null,
    },
    methods: {
        initialise() {
            this.getAllRecipes();
        },
        getAllRecipes() {
            axios.get(GET_RECIPES_URL)
            .then(response=> {
                this.recipes = response.data;
            })
            .catch(error=>{
                console.log(error);
            })
        },
        getRecipe(id) {
            axios.get(GET_RECIPES_ID_URL+id)
            .then(response=>{
                this.recipes = response.data;
                console.log(this.recipes);
            })
            .catch(error=>{
                this.recipes = response.data;
            })
        },
        edit(id) {

        }
    },
    mounted() {
        this.initialise();
    },
    
});