// @flow
import Publisher from "./Components/SearchFacets/Publisher";
import Format from "./Components/SearchFacets/Format";
import Region from "./Components/SearchFacets/Region";
import Temporal from "./Components/SearchFacets/Temporal";

const fallbackApiHost = "//magda-dev.terria.io/";

const homePageConfig: {
    baseUrl: string,
    backgroundImageUrls: Array<string>
} =
    window.magda_client_homepage_config || {};

const serverConfig: {
    authApiBaseUrl?: string,
    baseUrl?: string,
    discussionsApiBaseUrl?: string,
    previewMapBaseUrl?: string,
    registryApiBaseUrl?: string,
    searchApiBaseUrl?: string,
    feedbackApiBaseUrl?: string
} =
    window.magda_server_config || {};

const registryApiUrl =
    serverConfig.registryApiBaseUrl || fallbackApiHost + "api/v0/registry/";
const previewMapUrl =
    serverConfig.previewMapBaseUrl || fallbackApiHost + "preview-map/";
const proxyUrl = previewMapUrl + "proxy/";
export const config = {
    homePageConfig: homePageConfig,
    appName: "data.gov.au",
    about:
        "<p><span style='color:#00698f;'>Data.gov.au</span> provides an easy way to find, access and reuse public data.</p><p> Our team works across governments to publish data and continue to improve functionality based on user feedback.</p>",
    baseUrl: serverConfig.baseUrl || fallbackApiHost,
    searchApiUrl:
        serverConfig.searchApiBaseUrl || fallbackApiHost + "api/v0/search/",
    registryApiUrl: registryApiUrl,
    adminApiUrl:
        serverConfig.adminApiBaseUrl || fallbackApiHost + "api/v0/admin/",
    authApiUrl: serverConfig.authApiBaseUrl || fallbackApiHost + "api/v0/auth/",
    discussionsApiUrl:
        serverConfig.discussionsApiBaseUrl ||
        fallbackApiHost + "api/v0/discussions/",
    feedbackUrl:
        serverConfig.feedbackApiBaseUrl ||
        fallbackApiHost + "api/v0/feedback/user",
    previewMapUrl: previewMapUrl,
    proxyUrl: proxyUrl,
    rssUrl: proxyUrl + "_0d/https://blog.data.gov.au/blogs/rss.xml",
    resultsPerPage: 10,
    disableAuthenticationFeatures:
        serverConfig.disableAuthenticationFeatures || false,
    enableSuggestDatasetPage: false,
    breakpoints: {
        small: 768,
        medium: 992,
        large: 1200
    },
    appTitle: "Australian open data search",
    facets: [
        { id: "publisher", component: Publisher },
        { id: "region", component: Region },
        { id: "temporal", component: Temporal },
        { id: "format", component: Format }
    ],
    headerNavigation: [
        ["Datasets", "search"],
        ["About", "page/about"],
        ["Publishers", "publishers"],
        ...(serverConfig.disableAuthenticationFeatures ? [] : [])
    ],
    footerNavigation: {
        // small media query (mobile)
        small: [
            {
                category: "Data.gov.au",
                links: [
                    ["About", "page/about"],
                    ["Suggest a dataset", "mailto:data@digital.gov.au"],
                    ["Sign in", "https://data.gov.au/user/login"],
                    ["Give feedback", "feedback"]
                ]
            }
        ],
        // medium media query and bigger (desktop)
        medium: [
            {
                category: "Data.gov.au",
                links: [
                    ["About", "page/about"],
                    ["Suggest a dataset", "mailto:data@digital.gov.au"],
                    ["Privacy Policy", "page/privacy-policy"]
                ]
            },
            {
                category: "Publishers",
                links: [
                    ["Sign in", "https://data.gov.au/user/login"],
                    ["Open data toolkit", "https://toolkit.data.gov.au/"]
                ]
            },
            {
                category: "Developers",
                links: [
                    ["Powered by Magda", "https://github.com/TerriaJS/magda/"]
                ]
            }
        ]
    },
    months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ],
    boundingBox: {
        west: 105,
        south: -45,
        east: 155,
        north: -5
    }
};
