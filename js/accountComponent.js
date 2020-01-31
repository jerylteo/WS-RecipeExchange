Vue.component("app-login-account", {
    template: 
    `
    <section class="login">
        <h2>Login</h2>
        <form @submit.prevent>
            <div class="formgroup">
                <label for="username">Username: </label>
                <input type="text" id="username" v-model='account.username'>
            </div>
            <div class="formgroup">
                <label for="password">Password: </label>
                <input type="password" id="password" v-model='account.password'>
            </div>
            <div class="formgroup">
                <label for="rmb">Remember Me: </label>
                <input type="checkbox" name="rmb" id="rmb" v-model='account.remember'>
            </div>
            <div class="formgroup buttons">
                <button @click='login()' class="btn btn-main">LOGIN</button>
            </div>
        </form>
    </section>
    `,
    data() {
        return {
            account: {
                username: '',
                password: '',
                remember: false,
            }
        }
    },
    methods: {
        login() {
            var form = new FormData();
            form.append('username', this.account.username);
            form.append('password', this.account.password);

            axios.post(POST_LOGIN_URL, form)
            .then(response=>{
                console.log(response);
                sessionStorage.setItem("token", response.data.token);
                window.location.href = "./index.html";
            })
            .catch(error=> {
                console.log(error);
            })
        }
    }
});

Vue.component("app-register-account", {
    template: 
    `
        <section class="register">
            <h2>Register</h2>
            <form @submit.prevent>
                <div class="formgroup">
                    <label for="username">Username: </label>
                    <input type="text" id="username">
                </div>
                <div class="formgroup">
                    <label for="password">Password: </label>
                    <input type="password" id="password">
                </div>
                <div class="formgroup">
                    <label for="email">Email: </label>
                    <input type="email" id="email">
                </div>
                <div class="formgroup buttons">
                    <button class="btn btn-main" @click='register'>REGISTER</button>
                    <button class="btn btn-reset">RESET</button
                </div>
            </form>
        </section>
    `,
    data() {
        return {
            account: {
                username: '',
                password: '',
                email: '',
            }
        }
    },
    methods: {
        register() {
            var form = new FormData();
            form.append('username', this.account.username);
            form.append('password', this.account.password);
            form.append('email', this.account.email);

            axios.post(POST_REGISTER_URL, form)
            .then(response=>{
                console.log(response);
            })
            .catch(error=> {
                console.log(error);
            })
        }
    }
})