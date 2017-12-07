import * as URI from 'urijs';
import * as moment from 'moment'

export interface CkanUrlBuilderOptions {
    name?: string,
    baseUrl: string;
    apiBaseUrl?: string;
    retrievedAt?: number;
}

export default class CkanUrlBuilder {
    public readonly name: string;
    public readonly baseUrl: uri.URI;
    public readonly apiBaseUrl: uri.URI;
    public readonly retrievedAt: string

    constructor(options: CkanUrlBuilderOptions) {
        this.name = options.name || 'CKAN';
        this.baseUrl = new URI(options.baseUrl);
        this.retrievedAt = moment(options.retrievedAt).toISOString();

        if (options.apiBaseUrl) {
            this.apiBaseUrl = new URI(options.apiBaseUrl);
        } else {
            this.apiBaseUrl = this.baseUrl.clone().segment('api');
        }
    }

    public getPackageSearchUrl(): string {
        return this.apiBaseUrl.clone().segment('3/action/package_search').toString();
    }

    public getOrganizationListUrl(): string {
        return this.apiBaseUrl.clone().segment('3/action/organization_list').toString();
    }

    public getPackageShowUrl(id: string): string {
        return this.apiBaseUrl.clone().segment('3/action/package_show').addSearch('id', id).toString();
    }

    public getResourceShowUrl(id: string): string {
        return this.apiBaseUrl.clone().segment('3/action/resource_show').addSearch('id', id).toString();
    }

    public getOrganizationShowUrl(id: string): string {
        return this.apiBaseUrl.clone().segment('3/action/organization_show').addSearch('id', id).toString();
    }

    public getOrganizationAutocompleteUrl(query: string): string {
        return this.apiBaseUrl.clone().segment('3/action/organization_autocomplete').addSearch('q', query).toString();
    }

    public getDatasetLandingPageUrl(id: string): string {
        return this.baseUrl.clone().segment('dataset').segment(id).toString();
    }
}