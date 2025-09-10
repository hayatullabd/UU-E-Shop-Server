exports.getTotalPayableToday = (items, today) => {
    const todayDate = today.toDateString();
    let total = 0;

    for (const item of items) {
        const payableDate = new Date(item.payableDate).toDateString();
        if (payableDate === todayDate) {
            total += item.amount;
        }
    }

    return total;
}

exports.getCurrentMonthTotalAmount = (data) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let total = 0;

    for (const item of data) {
        const payableDate = new Date(item.payableDate);
        if (payableDate.getMonth() === currentMonth && payableDate.getFullYear() === currentYear) {
            total += item.amount;
        }
    }

    return total;
}

 exports.getTotalAmountInDateRange=(arrayData, startDate, endDate)=> {
    let total = 0;

    for (const item of arrayData) {
        const payableDate = new Date(item.payableDate);
        if (payableDate >= startDate && payableDate <= endDate) {
            total += item.amount;
        }
    }

    return total;
}
