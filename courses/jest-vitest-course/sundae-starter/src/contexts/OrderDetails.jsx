import { createContext, useContext, useState } from "react";
import { pricePerItem } from "../constants";

const OrderDetails = createContext();

// create custom hook to check whether we're in a provider
export function useOrderDetails() {
    const contextValue = useContext(OrderDetails)

    if (!contextValue) {
        throw new Error ('useOrderDetails must be called within an OrderDetailsProvider')
    }

    return contextValue
}

export function OrderDetailsProvider(props) {
    const [optionCounts, setOptionCounts] = useState({
        scoops: {}, // {Chocolate: 1, Vanilla: 2}
        toppings: {} // {'Gummi Bears' : 1}
    })

    const updateItemCount = (itemName, newItemCount, optionType) => {
        //make copy of existing state
        const newOptionCounts = {...optionCounts}

        // update copy with new info
        newOptionCounts[optionType][itemName] = newItemCount

        // update state with updated copy
        setOptionCounts(newOptionCounts)
    }

    const resetOrder = () => {
        setOptionCounts({scoops: {}, toppings: {}})
    }

    //utility function to derive totals
    const calcTotal = (optionType) => {
        const countsArray = Object.values(optionCounts[optionType])
        const totalCount = countsArray.reduce((total, value) => total + value, 0)
        const totalCost = totalCount * pricePerItem[optionType]
        return totalCost
    }

    const totals = {
        scoops: calcTotal('scoops'),
        toppings: calcTotal('toppings')
    }

    const value = {optionCounts, updateItemCount, resetOrder, totals}
    return <OrderDetails.Provider value={value} {...props} />
}
