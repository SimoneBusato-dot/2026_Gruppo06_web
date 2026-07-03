import { writable } from 'svelte/store';

const STORAGE_KEY = 'categorie.hasNavigated';

function createHasNavigatedStore() {
    const initial = typeof sessionStorage !== 'undefined'
        ? sessionStorage.getItem(STORAGE_KEY) === 'true'
        : false;

    const { subscribe, set } = writable(initial);

    return {
        subscribe,
        markNavigated() {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem(STORAGE_KEY, 'true');
            }
            set(true);
        },
        reset() {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.removeItem(STORAGE_KEY);
            }
            set(false);
        }
    };
}

export const hasNavigatedCategory = createHasNavigatedStore();

const WARNING_STORAGE_KEY = 'warning.gateCompleted';

function createGateCompletedStore() {
    const initial = typeof sessionStorage !== 'undefined'
        ? sessionStorage.getItem(WARNING_STORAGE_KEY) === 'true'
        : false;

    const { subscribe, set } = writable(initial);

    return {
        subscribe,
        markCompleted() {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem(WARNING_STORAGE_KEY, 'true');
            }
            set(true);
        },
        reset() {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.removeItem(WARNING_STORAGE_KEY);
            }
            set(false);
        }
    };
}

export const warningGateCompleted = createGateCompletedStore();