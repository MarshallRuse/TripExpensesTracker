const drawerReducer = (state, action) => {
    switch (action.type){
        case 'SUMMARY_OPEN':
            return {
                ...state,
                summaryDrawerOpen: true
            }
        case 'SUMMARY_CLOSE':
            return {
                ...state,
                summaryDrawerOpen: false
            }
        case 'SIDE_DRAWER_OPEN':
            return {
                ...state,
                sideDrawerOpen: true
            };
        case 'SIDE_DRAWER_CLOSE':
            return {
                ...state,
                sideDrawerOpen: false
            };
        default:
            return state;
    }
};

export default drawerReducer;