import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard, User, Home, Coffee, LogOut } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Hostel Hub</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-sm font-medium mr-4">
               <Link to="/rooms" className="text-slate-400 hover:text-white transition">Rooms</Link>
               <Link to="/mess" className="text-slate-400 hover:text-white transition">Mess</Link>
               <Link to="/bills" className="text-slate-400 hover:text-white transition">Bills</Link>
               <Link to="/leave" className="text-slate-400 hover:text-white transition">Leave</Link>
            </div>
            <span className="text-sm text-slate-400">Welcome, <span className="text-white font-medium">{data?.student?.name}</span></span>
            <button onClick={logout} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition" title="Log Out">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <div className="glass rounded-2xl p-6 bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 transition duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <User size={28} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{data?.student?.name}</h3>
                <p className="text-slate-400 text-sm">{data?.student?.email}</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-700/50">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Roll No</span>
                <span className="font-medium text-white">{data?.student?.roll_no}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Semester</span>
                <span className="font-medium text-white">{data?.student?.semester} (Year {data?.student?.year})</span>
              </div>
            </div>
          </div>

          {/* Room Card */}
          <div className="glass rounded-2xl p-6 bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 transition duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition duration-300">
                <Home size={28} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Accommodation</h3>
                <p className="text-slate-400 text-sm">Your current room status</p>
              </div>
            </div>
            <div className="mt-4">
              {data?.student?.room_no ? (
                <div className="text-center py-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <span className="block text-slate-400 text-sm mb-1">Room Assigned</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {data.student.room_no}
                  </span>
                </div>
              ) : (
                <div className="text-center py-4 bg-slate-900/50 rounded-xl border border-slate-700/50 flex flex-col items-center gap-3">
                  <span className="text-slate-400 text-sm">No room assigned yet</span>
                  <Link to="/rooms" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-medium rounded-lg shadow-lg hover:shadow-purple-500/25 transition">
                    Choose Room
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Attendance Calendar Card */}
          <div className="md:col-span-2 lg:col-span-3 glass rounded-2xl p-6 bg-slate-800/40 border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Coffee size={24} className="text-emerald-400" />
                Attendance Calendar
              </h3>
              <div className="text-right">
                <span className="text-slate-400 text-xs block uppercase tracking-wider mb-1">Success Rate</span>
                <span className="text-2xl font-black text-emerald-400">
                  {data?.attendancePercentage || 0}%
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs text-slate-500 font-bold uppercase">{day}</div>
              ))}
              {/* Simplified Calendar: Last 28 days for demo */}
              {[...Array(28)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (27 - i));
                const dateStr = date.toISOString().split('T')[0];
                const isPresent = data?.attendanceHistory?.some(a => a.date.split('T')[0] === dateStr && a.present);
                const isToday = i === 27;
                
                return (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center border transition-all ${
                      isPresent 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/10' 
                      : 'bg-red-500/20 border-red-500/50 text-red-400'
                    } ${isToday ? 'ring-2 ring-white scale-105 z-10' : ''}`}
                    title={dateStr}
                  >
                    <span className="text-xs font-bold">{date.getDate()}</span>
                    {isPresent ? (
                      <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1"></div>
                    ) : (
                      <div className="w-1 h-1 rounded-full bg-red-400 mt-1"></div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 text-xs text-slate-400 mt-6 border-t border-slate-700/50 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/50"></div>
                <span>Absent</span>
              </div>
              <div className="ml-auto text-slate-500 font-medium">Last 28 Days</div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
