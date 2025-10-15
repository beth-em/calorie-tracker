import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './App.css'; // Import our custom CSS file

// Main App Component
const NutritionTracker = () => {
  // State to track the current date being viewed
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // State to track the user's daily calorie goal
  const [calorieGoal, setCalorieGoal] = useState(2000);
  
  // State to track meals for each day (stored by date string as key)
  const [dailyMeals, setDailyMeals] = useState({});
  
  // State to toggle between monthly and weekly view
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'weekly'

  // Get the current month and year from currentDate
  const month = currentDate.getMonth(); // 0-11
  const year = currentDate.getFullYear();
  
  // Get today's date for highlighting
  const today = new Date();
  const todayString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  // Array of month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Array of day names for the calendar header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate the number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get the day of week for the first day of the month (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Generate an array of all days in the month
  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  // Calculate total calories for a specific day
  const getTotalCalories = (day) => {
    // Create a unique key for this date
    const dateKey = `${year}-${month}-${day}`;
    const meals = dailyMeals[dateKey];
    
    // If no meals recorded, return 0
    if (!meals) return 0;
    
    // Sum up calories from all meal types
    let total = 0;
    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
      if (meals[mealType]) {
        total += meals[mealType].calories || 0;
      }
    });
    
    return total;
  };

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Function to navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Function to get a pastel color based on the day number
  const getPastelColor = (day) => {
    const dateKey = `${year}-${month}-${day}`;
    
    // If it's today, return pastel green
    if (dateKey === todayString) {
      return '#A8E6B7'; // Pastel green
    }
    
    // Cycle through pastel colors for other days
    const colors = ['#C4B5A0', '#A8D8EA', '#FFB6C1']; // Brown, Blue, Pink
    return colors[day % colors.length];
  };

  // Render the calendar grid
  const renderCalendar = () => {
    // Create empty cells for days before the first day of the month
    const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => (
      <div key={`empty-${i}`} className="calendar-day-empty"></div>
    ));

    // Create cells for each day of the month
    const dayCells = daysArray.map(day => {
      const totalCalories = getTotalCalories(day);
      const dateKey = `${year}-${month}-${day}`;
      const isToday = dateKey === todayString;

      return (
        <div
          key={day}
          className="calendar-day"
        >
          {/* Day number with colored dot indicator */}
          <div className="day-header">
            <span className="day-number">{day}</span>
            <div
              className="day-indicator"
              style={{ backgroundColor: getPastelColor(day) }}
            ></div>
          </div>
          
          {/* Calorie count display */}
          {totalCalories > 0 && (
            <div className="calorie-count">
              {totalCalories} cal
            </div>
          )}
        </div>
      );
    });

    return [...emptyCells, ...dayCells];
  };

  return (
    <div className="app-container">
      {/* Header section with calorie goal */}
      <div className="content-wrapper">
        {/* Daily calorie goal box */}
        <div className="calorie-goal-box">
          <h2 className="section-title">Daily Calorie Goal</h2>
          <div className="goal-input-group">
            <input
              type="number"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(Number(e.target.value))}
              className="calorie-input"
            />
            <span className="input-label">calories per day</span>
          </div>
          
          {/* Progress bar for today's intake */}
          <div className="progress-section">
            <div className="progress-header">
              <span>Today's Progress</span>
              <span>{getTotalCalories(today.getDate())} / {calorieGoal} cal</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min((getTotalCalories(today.getDate()) / calorieGoal) * 100, 100)}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Calendar navigation header */}
        <div className="calendar-header">
          {/* Month/Year display with navigation arrows */}
          <div className="month-navigation">
            <button
              onClick={goToPreviousMonth}
              className="nav-button"
            >
              <ChevronLeft className="nav-icon" />
            </button>
            
            <h1 className="month-title">
              {monthNames[month]} {year}
            </h1>
            
            <button
              onClick={goToNextMonth}
              className="nav-button"
            >
              <ChevronRight className="nav-icon" />
            </button>
          </div>

          {/* View mode toggle buttons */}
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('monthly')}
              className={`toggle-button ${viewMode === 'monthly' ? 'active' : ''}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`toggle-button ${viewMode === 'weekly' ? 'active' : ''}`}
            >
              Weekly
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="weekday-header">
          {dayNames.map(dayName => (
            <div key={dayName} className="weekday-name">
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="calendar-grid">
          {renderCalendar()}
        </div>
      </div>

      {/* Information footer */}
      <div className="footer-info">
        <p>Click on any day to add meals and track your nutrition</p>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#A8E6B7' }}></div>
            <span>Today</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#C4B5A0' }}></div>
            <span>Past Days</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#A8D8EA' }}></div>
            <span>Upcoming</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTracker;