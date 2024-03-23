import { createContext, useState } from "react";

export const GlobalContext = createContext(null);

export default function GlobalState({children}) {
    const [searchParam, setSearchParam] = useState('');
    const [loading, setLoading] = useState(false);
    const [recipeList, setRecipeList] = useState([]);
    const [recipeDetailsData, setRecipeDetailsData] = useState(null);
    const [favouritesList, setFavouritesList] = useState([]);

    async function handleSubmit(event) {

        event.preventDefault();

        try {
            setLoading(true);
            
            const resp = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`)

            const data = await resp.json();

            if (data?.data?.recipes) {
                setRecipeList(data?.data?.recipes);
                setLoading(false);
                setSearchParam('');
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
            setSearchParam('');
        }
    }

    function handleAddToFavourite(getCurrentItem) {
        let copyFavouritesList = [...favouritesList];
        const index = copyFavouritesList.findIndex(item => item.id === getCurrentItem.id);

        if (index === -1) {
            copyFavouritesList.push(getCurrentItem);
        } else {
            copyFavouritesList.splice(index);
        }

        setFavouritesList(copyFavouritesList);
    }

    return (
        <GlobalContext.Provider 
            value={{ 
                searchParam, 
                loading, 
                recipeList, 
                setSearchParam, 
                handleSubmit, 
                recipeDetailsData, 
                setRecipeDetailsData,
                handleAddToFavourite,
                favouritesList
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}