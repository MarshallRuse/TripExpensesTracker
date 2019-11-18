import moment from 'moment';

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

export const sortByCategory = (expenses, order) => {

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

    const sortedExpensesGroupedByCountry = order === 'ASC'
                                            ?   expensesGroupedByCategory.sort((groupA, groupB) => groupA.sumOfExpensesCost - groupB.sumOfExpensesCost)
                                            :   expensesGroupedByCategory.sort((groupA, groupB) => groupB.sumOfExpensesCost - groupA.sumOfExpensesCost);

    return sortedExpensesGroupedByCountry;

}