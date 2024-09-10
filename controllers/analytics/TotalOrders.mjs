import Order from "../../models/orders.mjs";

export const getTotalOrders = async (groupBy) => {
    const groupFields = {
      day: {
        _id: {
          day: { $dayOfWeek: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        totalOrders: { $sum: 1 }
      },
      week: {
        _id: {
          week: { $isoWeek: "$createdAt" },  // Get ISO week number
          year: { $year: "$createdAt" }       // Get the year
        },
        totalOrders: { $sum: 1 }
      },
      month: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        totalOrders: { $sum: 1 }
      },
      year: {
        _id: {
          year: { $year: "$createdAt" }
        },
        totalOrders: { $sum: 1 }
      }
    };
  
    const sortFields = {
      day: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      week: { "_id.year": 1, "_id.week": 1 },
      month: { "_id.year": 1, "_id.month": 1 },
      year: { "_id.year": 1 }
    };
  
    const projectFields = {
      day: {
        _id: 0,
        date: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            { $toString: "$_id.month" },
            "-",
            { $toString: "$_id.day" }
          ]
        },
        totalOrders: 1
      },
      week: {
        _id: 0,
        date: {
          $concat: [
            { $toString: "$_id.year" },
            "-W",
            { $toString: "$_id.week" }
          ]
        },
        totalOrders: 1
      },
      month: {
        _id: 0,
        date: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            { $toString: "$_id.month" }
          ]
        },
        totalOrders: 1
      },
      year: {
        _id: 0,
        date: { $toString: "$_id.year" },
        totalOrders: 1
      }
    };

    return await Order.aggregate([
      {
        $group: groupFields[groupBy]
      },
      {
        $sort: sortFields[groupBy]
      },
      {
        $project: projectFields[groupBy]
      }
    ]);
  };
  
  // Endpoint: Total Orders Per Day
export const orderPerDayData = async (req, res) => {
  const dailyList = [
    { day: 'Sun', totalOrders: 0 },
    { day: 'Mon', totalOrders: 0 },
    { day: 'Tue', totalOrders: 0 },
    { day: 'Wed', totalOrders: 0 },
    { day: 'Thu', totalOrders: 0 },
    { day: 'Fri', totalOrders: 0 },
    { day: 'Sat', totalOrders: 0 }
  ]

  try {
    const ordersPerDay = await getTotalOrders('day');
    ordersPerDay.forEach((order) => {
      const dateParts = order.date.split('-');
      const dayOfWeek = Number(dateParts[2]); // Gets the day of the month
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[(dayOfWeek - 1) % 7];
      const index = (dayOfWeek - 1) % 7;
      dailyList[index].totalOrders = order.totalOrders;
    })
    res.json(dailyList);
  } catch (err) {
    res.status(500).send('Server Error');
  }
}
  
  // Endpoint: Total Orders Per Week
// Endpoint: Total Orders Per Week
export const orderPerWeekData = async (req, res) => {
  try {
    // Get the current year or specify a year
    const currentYear = new Date().getFullYear();
    
    // Initialize the list with weeks numbered from 1 to 52 (or 53 if applicable)
    const weeksList = Array.from({ length: 53 }, (_, i) => ({
      week: i + 1,
      year: currentYear,
      totalOrders: 0
    }));
    
    // Get the orders per week from the database
    const ordersPerWeek = await getTotalOrders('week');
    
    // Update the weeksList with actual order data from the aggregation
    ordersPerWeek.forEach(order => {
      const weekNumber = order.date.split('-W')[1]; // Extract week number
      const weekIndex = weeksList.findIndex(week => week.week === parseInt(weekNumber, 10));
      if (weekIndex !== -1) {
        weeksList[weekIndex].totalOrders = order.totalOrders;
      }
    });
    
    // Filter out weeks for the specific year to make sure it covers the entire year
    const filteredWeeks = weeksList.filter(week => week.year === currentYear);
    
    res.json(filteredWeeks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
}

  
  // Endpoint: Total Orders Per Month
// Endpoint: Total Orders Per Month
// Endpoint: Total Orders Per Month
export const orderPerMonthData = async (req, res) => {
  try {
    // Get the current year or specify a year
    const currentYear = new Date().getFullYear();
    
    // Define month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Initialize the list with months named from January to December
    const monthsList = monthNames.map((monthName, index) => ({
      month: monthName,
      year: currentYear,
      totalOrders: 0
    }));

    // Get the orders per month from the database
    const ordersPerMonth = await getTotalOrders('month');
    
    // Update the monthsList with actual order data from the aggregation
    ordersPerMonth.forEach(order => {
      const [year, month] = order.date.split('-'); // Extract year and month
      const monthNumber = parseInt(month, 10);
      const monthIndex = monthNumber - 1; // Convert to zero-based index
      if (monthIndex >= 0 && monthIndex < 12 && parseInt(year, 10) === currentYear) {
        monthsList[monthIndex].totalOrders = order.totalOrders;
      }
    });
    
    // Filter out months for the specific year to make sure it covers the entire year
    const filteredMonths = monthsList.filter(month => month.year === currentYear);
    
    res.json(filteredMonths);
  } catch (err) {
    res.status(500).send('Server Error');
  }
}

  
  // Endpoint: Total Orders Per Year
export const orderPerYearData = async (req, res) => {
    try {
      const ordersPerYear = await getTotalOrders('year');
      res.json(ordersPerYear);
    } catch (err) {
      res.status(500).send('Server Error');
    }
}
