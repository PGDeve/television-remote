import axios, { AxiosError, AxiosResponse } from "axios";
import { setError, setIsLoading } from "../store/remote/remoteSlice";
import { store } from "../store/store";

axios.defaults.baseURL = `${process.env.REACT_APP_BE_ORIGIN}/remote`;

const handleError = (error: any) => {
    const { response } = error as AxiosError;
    const data: string = (response as AxiosResponse).data;
    store.dispatch(
        setError({
            title: "An error occurred!",
            description: data,
        })
    );
    store.dispatch(setIsLoading(false));
}

export const nextChannel = async () => {
    try {
        await axios.get('/nextChannel');
    } catch (error: any) {
        handleError(error);
    }
}
export const previousChannel = async () => {
    try {
        await axios.get('/previousChannel');
    } catch (error) {
        handleError(error);
    }
}