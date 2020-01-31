let userVue = new Vue({
    el: '#userVue',
    data: {
        user: {
            loggedIn: false,
            id: '',
            username: '',
            password: '',
            email: '',
            role: '',
        },
        token: sessionStorage.getItem('token'),
    },
    methods: {
        checkLogin() {
            if (this.token) {
                axios.get(GET_USER_TOKEN_URL + this.token)
                .then(response=> {
                    this.user.loggedIn = true;
                    this.user.id = response.data.id;
                    this.user.username = response.data.username;
                    this.user.password = response.data.password;
                    this.user.email = response.data.email;
                    this.user.role = response.data.role;

                    sessionStorage.setItem('user', JSON.stringify(this.user));
                })
                .catch(error=> {
                    console.log(error);
                })
            }
        },
        logout() {
            axios.get(GET_LOGOUT_TOKEN_URL + this.token)
            .then(response=>{
                sessionStorage.clear();
                window.location.href = "./index.html";
                this.user.loggedIn = false;
                console.log(this.user.loggedIn);
            })
            .catch(error=> {
                console.log(error);
            })
        }
    },
    mounted() {
        this.checkLogin();
    }
})