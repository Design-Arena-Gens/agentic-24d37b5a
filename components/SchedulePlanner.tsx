'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaClock, FaChevronLeft, FaChevronRight, FaBell } from 'react-icons/fa';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  category: 'class' | 'meeting' | 'personal';
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  reminder?: boolean;
  notes?: string;
}

const categoryColors = {
  class: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  meeting: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  personal: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
};

export default function SchedulePlanner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showFreeTime, setShowFreeTime] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    category: 'class' as Event['category'],
    recurring: 'none' as Event['recurring'],
    reminder: true,
    notes: '',
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem('scheduleEvents');
    if (savedEvents) {
      const parsed = JSON.parse(savedEvents);
      setEvents(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })));
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('scheduleEvents', JSON.stringify(events));
    }
  }, [events]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleAddEvent = () => {
    if (!formData.title || !formData.date) {
      alert('Please fill in title and date');
      return;
    }

    const newEvent: Event = {
      id: editingEvent?.id || Date.now().toString(),
      title: formData.title,
      date: new Date(formData.date),
      startTime: formData.startTime,
      endTime: formData.endTime,
      category: formData.category,
      recurring: formData.recurring,
      reminder: formData.reminder,
      notes: formData.notes,
    };

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? newEvent : e));
    } else {
      setEvents([...events, newEvent]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      category: 'class',
      recurring: 'none',
      reminder: true,
      notes: '',
    });
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: format(event.date, 'yyyy-MM-dd'),
      startTime: event.startTime,
      endTime: event.endTime,
      category: event.category,
      recurring: event.recurring || 'none',
      reminder: event.reminder || false,
      notes: event.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const analyzeFreeTime = () => {
    const timeSlots: string[] = [];
    for (let hour = 8; hour < 18; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    const busySlots = events
      .filter(e => isSameDay(e.date, currentDate))
      .map(e => ({ start: e.startTime, end: e.endTime }));

    const freeSlots = timeSlots.filter(slot => {
      return !busySlots.some(busy => slot >= busy.start && slot < busy.end);
    });

    return freeSlots;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Previous month"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Next month"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Today
            </button>
            <button
              onClick={() => setShowFreeTime(!showFreeTime)}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {showFreeTime ? 'Hide' : 'Show'} Free Time
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FaPlus />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {showFreeTime && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200"
          >
            <h3 className="font-semibold text-green-800 mb-2">Available Time Slots Today:</h3>
            <div className="flex flex-wrap gap-2">
              {analyzeFreeTime().length > 0 ? (
                analyzeFreeTime().map(slot => (
                  <span key={slot} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                    {slot}
                  </span>
                ))
              ) : (
                <span className="text-green-700">No free slots available today</span>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(day => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isTodayDate = isToday(day);

            return (
              <motion.button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                whileHover={{ scale: 1.05 }}
                className={`
                  min-h-[80px] p-2 rounded-lg border-2 transition-all
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${isTodayDate ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  ${selectedDate && isSameDay(selectedDate, day) ? 'ring-2 ring-blue-400' : ''}
                  hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400
                `}
              >
                <div className={`text-sm font-semibold mb-1 ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${categoryColors[event.category].bg} ${categoryColors[event.category].text}`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Events List for Selected Date */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Events for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          {getEventsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500">No events scheduled for this day</p>
          ) : (
            <div className="space-y-3">
              {getEventsForDate(selectedDate)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border-l-4 ${categoryColors[event.category].bg} ${categoryColors[event.category].border}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{event.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <FaClock />
                            <span>{event.startTime} - {event.endTime}</span>
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[event.category].bg} ${categoryColors[event.category].text}`}>
                            {event.category}
                          </span>
                          {event.reminder && (
                            <span className="flex items-center space-x-1 text-yellow-600">
                              <FaBell />
                            </span>
                          )}
                        </div>
                        {event.notes && (
                          <p className="mt-2 text-sm text-gray-600">{event.notes}</p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                          aria-label="Edit event"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                          aria-label="Delete event"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Add/Edit Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter event title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as Event['category'] })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="class">Class</option>
                      <option value="meeting">Meeting</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recurring
                    </label>
                    <select
                      value={formData.recurring}
                      onChange={e => setFormData({ ...formData, recurring: e.target.value as Event['recurring'] })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="none">None</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.reminder}
                        onChange={e => setFormData({ ...formData, reminder: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Enable reminder notification
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Add any additional notes..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddEvent}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
