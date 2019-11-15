const SummaryDrawerReducer = (state, action) => {
    switch (action.type){
        case 'OPEN':
            return {
                ...state,
                drawerOpen: true
            }
        case 'CLOSE':
            return {
                ...state,
                drawerOpen: false
            }
        default:
            return state;
    }
};

export default SummaryDrawerReducer;