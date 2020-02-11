import axios from "@/config/app";
import SettingsService from "./settingsService";

/**
 * Section service class.
 * Used to fetch data from api for inside DynamicSettings.vue
 * Data is stored inside store -> settings -> sections -> data
 */
export default class GitlabService extends SettingsService {

    /**
     * API endpoint URL
     * @returns string
     */
    getItemRequestUri() {
        return `integration/gitlab/settings`;
    }

    /**
     * Fetch item data from api endpoint
     * @returns {data}
     */
    getItem() {
        return axios.get(this.getItemRequestUri());
    }

    /**
     * Save item data
     * @param data
     * @returns {Promise<void>}
     */
    save(data) {
        return axios.put('integration/gitlab/settings', data);
    }
}
