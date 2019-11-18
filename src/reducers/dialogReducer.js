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
        case 'OPEN_SORT_DIALOG': 
                return {
                    ...state,
                    sortDialogOpen: true
                }
        case 'CLOSE_SORT_DIALOG':
            return {
                ...state,
                sortDialogOpen: false
            }
        default:
            return state;
    }
}

export default dialogReducer;