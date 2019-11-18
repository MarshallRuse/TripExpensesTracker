import moment from 'moment';

/////////////
// Expenses 
/////////////
export const sortByDateTime = (expenses, order) => {

    // Create an array of unique dates in the expenses
    const dates = expenses.map((expense) => expense.dateTime);
    const sortedDates = order === 'ASC' ? dates.sort((a, b) => new Date(a) - new Date(b)) : dates.sort((a, b) => new Date(b) - new Date(a));
    const formattedDates = sortedDates.map((date) => moment(date).format('MMMM Do, YYYY'));
    const uniqueDates = formattedDates.filter((date, index, self) => self.indexOf(date) === index);
    const expensesGroupedByUniqueDates = uniqueDates.map((date) => {

        // Sort within the days by time
        const filteredByDate = expenses.filter((expense) => moment(expense.dateTime).format('MMMM Do, YYYY') === date);
        const sortedByTime = order === 'ASC' 
                                ? filteredByDate.sort((expenseA, expenseB) => moment(expenseA.dateTime).diff(expenseB.dateTime, 'minutes'))
                                : filteredByDate.sort((expenseA, expenseB) => moment(expenseB.dateTime).diff(expenseA.dateTime, 'minutes'));
        return {
            groupOnValue: date,
            groupedItems : sortedByTime
        }
    })

    return expensesGroupedByUniqueDates;
}

export const sortByCost = (expenses, order) => {
    const sortedExpenses = order === 'ASC' 
                                ? expenses.sort((expenseA, expenseB) => expenseA.cost.inEUR - expenseB.cost.inEUR)
                                : expenses.sort((expenseA, expenseB) => expenseB.cost.inEUR - expenseA.cost.inEUR)

    return [{
        groupOnValue: undefined,
        groupedItems: sortedExpenses
    }]                            
}

export const sortByCountry = (expenses, order) => {

    // Mapping by countries should automatically order the countries by when they first had
    // expenses associated with them. 
    const countries = expenses.map((expense) => expense.location.country);
    const uniqueCountries = countries.filter((country, index, self) => self.indexOf(country) === index);
    order === 'DESC' && uniqueCountries.reverse();
    const expensesGroupedByCountry = uniqueCountries.map((country) => {
        
        // Sort by dateTime within country, in case countries are visited repeatedly and noncescutively
        const expensesForCountry = expenses.filter((expense) => expense.location.country === country);
        const sortedExpensesForCountry = order === 'ASC' 
                                            ?   expensesForCountry.sort((expenseA, expenseB) => moment(expenseA.dateTime).diff(expenseB.dateTime, 'minutes'))
                                            :   expensesForCountry.sort((expenseA, expenseB) => moment(expenseB.dateTime).diff(expenseA.dateTime, 'minutes'));

        return {
            groupOnValue: country,
            groupedItems: sortedExpensesForCountry
        };
    });

    return expensesGroupedByCountry;
}

export const sortByCategoryCost = (expenses, order) => {

    const categories = expenses.map((expense) => expense.category);
    const uniqueCategories = categories.filter((category, index, self) => self.indexOf(category) === index);
    const expensesGroupedByCategory = uniqueCategories.map((category) => {

        // Within category, add up costs for sorting order of categories
        const expensesByCategory = expenses.filter((expense) => expense.category === category);
        const sumOfExpensesCost = expensesByCategory.reduce((total, expense) => total + expense.cost.inEUR, 0);
        const sortedExpensesByCategory = order === 'ASC' 
                                            ?   expensesByCategory.sort((expenseA, expenseB) => expenseA.cost.inEUR - expenseB.cost.inEUR)
                                            :   expensesByCategory.sort((expenseA, expenseB) => expenseB.cost.inEUR - expenseA.cost.inEUR);
        return {
            groupOnValue: category,
            groupedItems: sortedExpensesByCategory,
            sumOfExpensesCost
        }

    });

    const sortedExpensesGroupedByCategory = order === 'ASC'
                                            ?   expensesGroupedByCategory.sort((groupA, groupB) => groupA.sumOfExpensesCost - groupB.sumOfExpensesCost)
                                            :   expensesGroupedByCategory.sort((groupA, groupB) => groupB.sumOfExpensesCost - groupA.sumOfExpensesCost);

    return sortedExpensesGroupedByCategory;

}

export const sortByCategoryTransactions = (expenses, order) => {

    const categories = expenses.map((expense) => expense.category);
    const uniqueCategories = categories.filter((category, index, self) => self.indexOf(category) === index);
    const expensesGroupedByCategory = uniqueCategories.map((category) => {

        // Within category, add up costs for sorting order of categories
        const expensesByCategory = expenses.filter((expense) => expense.category === category);
        const sortedExpensesByCategory = order === 'ASC' 
                                            ?   expensesByCategory.sort((expenseA, expenseB) => expenseA.cost.inEUR - expenseB.cost.inEUR)
                                            :   expensesByCategory.sort((expenseA, expenseB) => expenseB.cost.inEUR - expenseA.cost.inEUR);
        return {
            groupOnValue: category,
            groupedItems: sortedExpensesByCategory,
        }

    });

    const sortedExpensesGroupedByCategory = order === 'ASC'
                                            ?   expensesGroupedByCategory.sort((groupA, groupB) => groupA.groupedItems.length - groupB.groupedItems.length)
                                            :   expensesGroupedByCategory.sort((groupA, groupB) => groupB.groupedItems.length - groupA.groupedItems.length);

    return sortedExpensesGroupedByCategory;

}

/////////////
// Trips
/////////////

export const sortTripsByDateTime = async (trips, order) => {

    try {
        const tripsWithStartDate = await Promise.all(trips.map(async (trip) => {
            const response = await fetch(`/get_expenses/${trip._id}`);
            const expenses = await response.json();

            // Trips without expenses are sorted as the latest dates, so give them
            // an arbitrary earliest date to sort them to the bottom when descended sort order passed
            let dates = [];
            if (expenses.length > 0){
                dates = expenses.map((expense) => moment(expense.dateTime));
            } else {
                dates = [moment(0)];
            }
            
            const earliestDate = moment.min(dates);
            trip.expenses = expenses;
            trip.earliestDate = earliestDate;

            return trip;
        }));


        const sortedTrips = order === 'ASC' 
                            ? tripsWithStartDate.sort((tripA, tripB) => tripA.earliestDate.diff(tripB.earliestDate, 'days'))
                            : tripsWithStartDate.sort((tripA, tripB) => tripB.earliestDate.diff(tripA.earliestDate, 'days'));
        return sortedTrips;
    } catch (err) {
        console.log('Could not retrieve trip\'s expenses for sorting: ', err);
        return trips;
    }
}

export const sortTripsByCost = async (trips, order) => {

    try {
        const tripsWithTotalCost = await Promise.all(trips.map(async (trip) => {

            const response = await fetch(`/get_expenses/${trip._id}`);
            const expenses = await response.json();

            const totalCostOfTrip = expenses.reduce((total, expense) => total + expense.cost.inEUR, 0);
            trip.totalCost = totalCostOfTrip;

            return trip;
            
        }));
        const sortedTrips = order === 'ASC' 
                            ? tripsWithTotalCost.sort((tripA, tripB) => tripA.totalCost - tripB.totalCost)
                            : tripsWithTotalCost.sort((tripA, tripB) => tripB.totalCost - tripA.totalCost);
        return sortedTrips;

    } catch (err){
        console.log('Could not retrieve trip\'s expenses for sorting: ', err);
        return trips;
    }
}

export const sortTripsByNumCities = async (trips, order) => {

    try {
        const tripsWithNumCities = await Promise.all(trips.map(async (trip) => {
            const response = await fetch(`/get_expenses/${trip._id}`);
            const expenses = await response.json();

            const cities = expenses.map((expense) => expense.location.city);
            const numUniqueCities = cities.filter((city, index, self) => self.indexOf(city) === index).length;

            trip.numUniqueCities = numUniqueCities;
            return trip;
        }));

        const sortedTrips = order === 'ASC' 
                            ? tripsWithNumCities.sort((tripA, tripB) => tripA.numUniqueCities - tripB.numUniqueCities)
                            : tripsWithNumCities.sort((tripA, tripB) => tripB.numUniqueCities - tripA.numUniqueCities);

        return sortedTrips;


    } catch (err) {
        console.log('Could not retrieve trip\'s expenses for sorting: ', err);
        return trips;
    }
}
