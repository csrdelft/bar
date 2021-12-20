import {Store} from "vuex";
import {getLocatieToken, getTokenData, removeLocatieToken, removeToken, setLocatieToken, setToken} from "@/token";

/**
 * Stop de token uit de cookie in de state en update de cookie als de state veranderd.
 * @param setTokenMutation
 * @param setLocatieTokenMutation
 */
export const saveTokenPlugin = (setTokenMutation: string, setLocatieTokenMutation: string) => <S>(store: Store<S>) => {
    const token = getTokenData();
    if (token) {
        store.commit(setTokenMutation, token);
    }

    const locatieToken = getLocatieToken();
    if (locatieToken) {
        store.commit(setLocatieTokenMutation, locatieToken);
    }

    store.subscribe((mutation) => {
        if (mutation.type === setTokenMutation) {
            if (mutation.payload) {
                setToken(mutation.payload);
            } else {
                removeToken();
            }
        }
        if (mutation.type === setLocatieTokenMutation) {
            if (mutation.payload) {
                setLocatieToken(mutation.payload);
            } else {
                removeLocatieToken();
            }
        }
    });
};
