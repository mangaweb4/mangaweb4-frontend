import { type Cookies } from "@sveltejs/kit";

export interface ViewOptions {
    grayscale: boolean,
    disableAnimation: boolean
}

export function getViewOptions(cookies: Cookies): ViewOptions {
    const viewOptionsStr = cookies.get('view_options')
    if (viewOptionsStr == undefined) {
        return {
            grayscale: false,
            disableAnimation: false,
        }
    }

    return JSON.parse(viewOptionsStr)
}

export function setViewOptions(cookies: Cookies, options: ViewOptions) {
    const viewOptionStr = JSON.stringify(options);
    cookies.set('view_options', viewOptionStr, { path: "/" })
}