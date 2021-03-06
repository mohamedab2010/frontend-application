import StoreService from './storeService';
import axios from 'axios';

export default class ApiService extends StoreService {
    storeNs = 'user';

    constructor(context) {
        super(context);
    }

    token() {
        return this.context.getters['token'];
    }

    checkApiAuth() {
        return axios
            .get('/auth/me', { ignoreCancel: true })
            .then(({ data }) => {
                const { user } = data;

                this.context.dispatch('setLoggedInStatus', true);
                this.context.dispatch('setUser', user);

                return Promise.resolve();
            })
            .catch(() => {
                localStorage.removeItem('access_token');
                this.context.dispatch('forceUserExit');

                return Promise.reject();
            });
    }

    setUserData(user) {
        this.context.dispatch('setUser', user);
    }

    setUserToken(token) {
        if (token) {
            localStorage.setItem('access_token', token);
        } else {
            localStorage.removeItem('access_token');
        }

        this.context.dispatch('setToken', token);
    }

    setLoggedInStatus(status = true) {
        this.context.dispatch('setLoggedInStatus', status);
    }

    isLoggedIn() {
        return this.context.getters.loggedIn;
    }

    attemptLogin(credentials) {
        return axios
            .post('/auth/login', credentials, { ignoreCancel: true })
            .then(({ data }) => {
                this.setUserToken(data.access_token);
                this.setUserData(data.user);
                this.setLoggedInStatus();

                return Promise.resolve(data);
            })
            .catch(response => {
                return Promise.reject(response);
            });
    }

    logout() {
        return axios.post('/auth/logout').then(() => {
            this.context.dispatch('forceUserExit');
        });
    }

    async getAllowedRules() {
        const { data } = await axios.get('/roles/allowed-rules', { ignoreCancel: true });

        this.context.dispatch('setAllowedRules', data.res);

        return data;
    }

    async getProjectRules() {
        const { data } = await axios.get('/roles/project-rules', { ignoreCancel: true });

        this.context.dispatch('setProjectRules', data.res);

        return data;
    }

    async getCompanyData() {
        const { data } = await axios.get('/companymanagement/getData', { ignoreCancel: true });

        this.context.dispatch('setCompanyData', data);

        return data;
    }
}
