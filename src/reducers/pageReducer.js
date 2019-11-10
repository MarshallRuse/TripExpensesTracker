const pageReducer = (state, action) => {
    switch (action.type){

        case 'SET_CURRENT_PAGE':

            console.log('VAL!', action.currentPage)
            return {
                ...state,
                currentPage: action.currentPage
            }
        default:
            return state;
    }
}

export default pageReducer;