exports.calculateCategoryTotals = (categories, history) => {
    const categoryTotals = [];
    // here protit ta categroye er total income expnse and return dibe

    /* {
"categoryId": "6550a61cda7c8acb65d98472",
"title": "test",
"totalIncome": 0,
"totalExpense": 0,
"totalReturn": 0
},
{
"categoryId": "6550b0c22fe7ea411ebd6ddf",
"title": "test category",
"totalIncome": 0,
"totalExpense": 0,
"totalReturn": 0
}
], */

    // Check if categories is an array
    if (!Array.isArray(categories)) {
        return {
            status: "fail",
            message: "Invalid data structure for categories",
        };
    }

    // Loop through each category
    categories.forEach((category) => {
        const categoryId = category._id;
        const title = category.title;
        let totalIncome = 0;
        let totalExpense = 0;
        let totalReturn = 0;

        // Loop through history for the current category
        history.forEach((item) => {
            if (item.category && item.category.toString() === categoryId.toString()) {
                switch (item.type) {
                    case 'income':
                        totalIncome += item.historyAmount;
                        break;
                    case 'expense':
                        totalExpense += item.historyAmount;
                        break;
                    case 'return':
                        totalReturn += item.historyAmount;
                        break;
                    default:
                        break;
                }
            }
        });

        // Format results for the current category
        const result = {
            categoryId,
            title,
            totalIncome,
            totalExpense,
            totalReturn,
        };

        // Push results to the categoryTotals array
        categoryTotals.push(result);
    });

    return categoryTotals;
};
