const dialogReducer = (state, action) => {
    switch (action.type){
        case 'OPEN':
            return {
                ...state,
                dialogOpen: true
            };
        case 'CLOSE':
            return {
                ...state,
                dialogOpen: false
            };
        case 'SET_EDIT_MODE_TRUE':
            return {
                ...state,
                editMode: true
            };
        case 'SET_EDIT_MODE_FALSE':
            return {
                ...state,
                editMode: false
            }
        case 'SET_ITEM_TO_EDIT':
            return {
                ...state,
                itemToEdit: action.itemToEdit
            }
        case 'SET_CREATE_ITEM_FUNCTION':
            return {
                ...state,
                createItemFunction: action.createItemFunction
            }
        case 'SET_EDIT_ITEM_FUNCTION':
                return {
                    ...state,
                    editItemFunction: action.editItemFunction
                }
        default:
            return state;
    }
}

export default dialogReducer;