const pageReducer = (state, action) => {
    switch (action.type){

        case 'SET_CURRENT_PAGE':
            return {
                ...state,
                currentPage: action.currentPage
            }
        case 'SET_TRIP_ID':
            return {
                ...state,
                tripID: action.tripID
            }
        default:
            return state;
    }
}

export default pageReducer;