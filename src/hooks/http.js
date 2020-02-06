import {useReducer, useCallback} from 'react';

const httpReducer = (httpState, action) => {
    switch(action.type){
        case 'SEND':
        return {error:null,loading:true,data:null};
        case 'RESPONSE':
        return {...httpState,loading:false,data:action.responseData};
        case 'ERROR':
        return {error:action.errorMessage,loading:false};
        case 'CLEAR':
        return {...httpState,error:null};
        default:
        throw new Error('Something wrong!');
    }
};

const useHttp = () => {
    const [httpState,dispatchHttp] = useReducer(httpReducer,{loading:false,error:null,data:null});
    const sendRequest = useCallback((url,method,body) => {
        dispatchHttp({type:'SEND'});

        fetch(url, {
            method  : method,
            body:body,
            headers : {
                'Content-Type' : 'application/json'
            }
            })
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                dispatchHttp({type:'RESPONSE',responseData:responseData});
            })
            .catch(error => {
            //Executed in Sync, batched together
            dispatchHttp({type:'ERROR', errorMessage:error.message});
        
        })
    }, []);
    return {
        isLoading : httpState.loading,
        data : httpState.data,
        error : httpState.error,
        sendRequest : sendRequest
    };
};

export default useHttp;