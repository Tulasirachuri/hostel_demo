import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Coffee, Utensils, CheckCircle, XCircle } from 'lucide-react';

const Mess = () => {
  const [menu, setMenu] = useState(null);
  const [attendance, setAttendance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, attRes] = await Promise.all([
          axios.get('http://localhost:5000/api/mess/menu'),
          axios.get('http://localhost:5000/api/mess/attendance')
        ]);
        setMenu(menuRes.data);
        setAttendance(attRes.data.present);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleAttendance = async () => {
    try {
      const newVal = !attendance;
      await axios.post('http://localhost:5000/api/mess/attendance', { present: newVal });
      setAttendance(newVal);
    } catch (err) {
      console.error(err);
    }
  };

  if(loading) return <div className="min-h-screen bg-slate-900 flex justify-center items-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">Mess & Dining</h1>
          <p className="text-slate-400">View today's menu and mark your attendance.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Menu Card */}
          <div className="glass rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <Utensils className="text-blue-400" />
              <h2 className="text-xl font-semibold">Today's Menu</h2>
            </div>
            {menu ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <span className="text-sm text-slate-400 block mb-1">Breakfast</span>
                  <p className="font-medium text-lg">{menu.breakfast}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <span className="text-sm text-slate-400 block mb-1">Lunch</span>
                  <p className="font-medium text-lg">{menu.lunch}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <span className="text-sm text-slate-400 block mb-1">Dinner</span>
                  <p className="font-medium text-lg">{menu.dinner}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 p-4 bg-slate-900/50 rounded-xl text-center border border-slate-700/50">Menu not updated yet for today.</p>
            )}
          </div>

          {/* Attendance Card */}
          <div className="glass rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <Coffee className="text-emerald-400" />
              <h2 className="text-xl font-semibold">Mess Attendance</h2>
            </div>
            <div className="flex flex-col items-center p-8 bg-slate-900/50 rounded-xl border border-slate-700/50">
              {attendance ? <CheckCircle size={64} className="text-emerald-500 mb-4 animate-bounce" /> : <XCircle size={64} className="text-red-500 mb-4" />}
              <h3 className="text-2xl font-bold mb-2">{attendance ? 'Present' : 'Absent'}</h3>
              <p className="text-slate-400 text-center text-sm mb-6">Will you be eating at the mess today?</p>
              <button 
                onClick={toggleAttendance}
                className={`px-8 py-3 rounded-xl font-semibold transition shadow-lg ${attendance ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'}`}
              >
                {attendance ? 'Mark Absent' : 'Mark Present'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mess;
