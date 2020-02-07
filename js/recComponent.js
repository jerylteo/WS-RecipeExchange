let recDetailComponent = Vue.component('rec-detail-comp', {
    template:
    `
    <section :class="{ 'editGrid': editStatus }">
        <article>
            <h3>{{rec.name}}</h3>
            <img :src="GET_IMAGE_URL + rec.image" :alt="rec.name">
            <div class="meta">
                <p class="desc">{{rec.description}}</p>
                <p class="category">{{rec.category}}</p>
                <p class="author">{{rec.author}}</p>
                <div class="likes">
                    <div class="likeInfo">
                        <img src="./_resources/_icons/like.png" alt="heart">
                        <span>{{rec.likes}}</span>
                    </div>
                    <div class="likeBtn">
                        <button class="btn btn-main" @click="likeRecipe()">FAV</button>
                    </div>
                </div>
                <div class="buttons">
                    <button class="btn btn-main" v-if="adminStatus" @click="editStatus = !editStatus">EDIT RECIPE</button>
                    <button class="btn btn-danger" @click="reportRecipe()">REPORT RECIPE</button>
                </div>
            </div>
        </article>
        <div v-if="editStatus">
            <form class="recipeEdit" @submit.prevent enctype="multipart/form-data">
                <h3>Edit Recipe</h3>
                <div class="formgroup">
                    <label>Name: </label>
                    <input type="text" v-model="rec.name">
                </div>
                <div class="formgroup">
                    <label>Category: </label>
                    <select name="category" id="category" v-model='rec.category_id'>
                        <option value="" selected disabled>CATEGORIES</option>
                        <option :value="cat.id" v-for="cat in categories" v-cloak>{{cat.category}}</option>
                    </select>
                </div>
                <div class="formgroup">
                    <label>Description: </label>
                    <input type="text" v-model="rec.description">
                </div>
                <div class="formgroup">
                    <label>Picture: </label>
                    <input type="file" @change="onImageChange($event)">
                </div>
                <button class="btn btn-main" @click="update">Save</button>
                <button class="btn returnBtn" @click="editStatus = false">Return</button>
            </form>
        </div>
    </section>
    `,
    data() {
        return {
            rec: undefined,
            editStatus: false,
            adminStatus: false,
            editStatus: false,
            categories: null,
        }
    },
    watch: {
        // editStatus(newVal) {
        //     console.log(newVal);
        // }
    },
    methods: {
        update() {
            console.log(this.rec);
            var id = this.rec.id;
            var form = new FormData();
            form.append('name', this.rec.name);
            form.append('description', this.rec.description);
            form.append('category_id', this.rec.category_id);
            form.append('author', this.rec.author);
            form.append('image', this.rec.image);

            axios.post(`${PUT_RECIPE_URL}${id}`, form)
            .then(response=>{
                console.log(response.data);
                alert("Update Successful");
                this.editStatus = false;
                // location.reload(true);
            })
            .catch(error=>{
                console.log(error);
            })
        },
        likeRecipe() {
            var likes = this.rec.likes + 1;
            var id = this.rec.id;
            var form = new FormData();
            form.append('likes', likes);

            axios.post(`${PUT_LIKE_RECIPE_ID_URL}${id}`, form)
            .then(response=> {
                console.log(response.data);
                alert("Successfully Liked");
                this.rec.likes += 1;
            })
        },
        reportRecipe() {
            var cfm = window.confirm("Are you sure you want to report this recipe?");
            if(cfm) {
                console.log(this.rec);
                var form = new FormData();
                form.append('report', this.rec.reportCount+1);
    
                axios.post(`${PUT_REPORT_RECIPE_ID_URL}${this.rec.id}`, form)
                .then(response=> {
                    console.log(response.data);
                    alert("Successfully Reported");
                    this.rec.reportCount += 1;
                    
                })
            }
        },
        getCategories() {
            axios.get(GET_CATEGORIES_URL)
            .then(response=> {
                this.categories = response.data;
                console.log(this.categories);
            })
        },
    },
    mounted() {
        this.rec = JSON.parse(sessionStorage.getItem('rec'));
        console.log(this.rec);
        var admin = JSON.parse(sessionStorage.getItem('user'));
        if (admin.role == 'Admin')  this.adminStatus = true;

        if (this.rec.author == admin.username)  this.adminStatus = true;
        this.getCategories();
    }
})