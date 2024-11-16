export const getCatalogProducts = async (csrfToken) => {
    let url = route("api.getCatalogProducts");
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken
        }
    });
    return await response.json();
}
export const getStatsData = async (csrfToken) => {
    let url = route("api.getStatsData");
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken
        }
    });
    return await response.json();
}
export const getQueryPageMetrics = async (csrfToken) => {
    let url = route("api.getQueryPageMetrics");
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken
        }
    });
    return await response.json();
}
export const getTrackingCodeSetPackages = async (csrfToken) => {

    let url = route("api.getTrackingCodeSetPackages");
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken
        }
    });
    return await response.json();
}
export const getNewPackages = async (csrfToken) => {

    let url = route("api.getNewPackages");
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken
        }
    });
    return await response.json();
}
export const getCustomers = async (csrfToken) => {

    let url = route("api.getCustomers");
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken
        }
    });
    return await response.json();
}
export const getGroups = async (csrfToken) => {

    let url = route("api.getGroups");
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken
        }
    });
    return await response.json();
}
export const getAllProducts = async (csrfToken) => {
    let url = route("api.getAllProducts");
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken
        }
    });
    return await response.json();
}

