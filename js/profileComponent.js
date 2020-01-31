Vue.component("app-profile-comp", {
    template: 
    `
    <article>
        <div class="profileContainer" :class="[editStatus ? 'editGrid' : '', 'normalGrid']">
        <section>
            <h1>Welcome {{profile.username}} ({{profile.role}})</h1>
            <div class="profile">
                <h3>Username: {{profile.username}}</h3>
                <p>Email: {{profile.email}}</p>
            </div>
            <button class="btn btn-main" @click="editStatus = !editStatus">{{this.editButton}}</button>
        </section>

        <section class="editProfile" v-if="editStatus">
            <form @submit.prevent>
                <div class="formgroup">
                    <label for="username">Username: </label>
                    <input type="text" id="username" v-model='profile.username'>
                </div>
                <div class="formgroup">
                    <label for="email">Email: </label>
                    <input type="email" id="email" v-model='profile.email'>
                </div>
                <div class="formgroup">
                    <label for="password">Password: </label>
                    <input type="password" id="password" v-model='profile.password'>
                </div>
                <div class="formgroup buttons">
                    <button @click='saveProfile()' class="btn btn-main">SAVE PROFILE</button>
                </div>
            </form>
        </section>
        </div>
        <section class="submittedRecipes">
            <h2>Submitted Recipes</h2>

            <div class="recipeCon">
                <div class="recipe" v-for="rec in recipes">
                    <article>
                        <h3>{{rec.name}}</h3>
                        <img :src="GET_IMAGE_URL + rec.image" :alt="rec.name" class="thumbnail">
                        <div class="meta">
                            <p class="desc">{{rec.description}}</p>
                            <p class="category">{{rec.category}}</p>
                            <p class="author">{{rec.author}}</p>
                            <div class="likes">
                                <img src="./_resources/_icons/like.png" alt="heart">
                                <span>{{rec.likes}}</span>
                            </div>
                            <button class="btn btn-main" @click="viewRecipe(rec)">View Recipe</button>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    </article>
    `,
    data() {
        return {
            profile: undefined,
            editStatus: false,
            editButton: 'EDIT PROFILE',
            recipes: undefined,
        }
    },
    watch: {
        editStatus: function(newVal) {
            newVal ? this.editButton = "CANCEL" : this.editButton = "EDIT PROFILE";
        }
    },
    methods: {
        initialise() {
            this.profile = JSON.parse(sessionStorage.getItem('user'));
            this.get_recipes();
        },
        edit() {
            this.editStatus = !this.editStatus;
        },
        get_recipes() {
            axios.get(GET_SUBMITTED_RECIPES_NAME_URL + this.profile.username)
            .then(response=> {
                this.recipes = response.data;
            })
            .catch(error=> {
                console.log(error);
            })
        },
        viewRecipe(rec) {
            console.log(rec);
            var temp = sessionStorage.getItem('rec', JSON.stringify(rec));
            if (temp) {
                sessionStorage.removeItem('rec');
            }
            
            sessionStorage.setItem('rec', JSON.stringify(rec));
            window.location.href = "./recipe.html";
        }
    },
    mounted() {
        this.initialise();
    }
});
