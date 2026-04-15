import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarRange, ClipboardList, Send } from 'lucide-react';

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({ from_date: '', to_date: '', reason: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leave');
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/leave', formData);
      setFormData({ from_date: '', to_date: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center gap-3">
          <CalendarRange className="w-8 h-8 text-amber-500" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Leave Applications</h1>
            <p className="text-slate-400">Apply for hostelite leaves and track statuses.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-8">
          {/* Apply Form */}
          <div className="glass rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50 h-fit sticky top-24 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Send size={20} className="text-amber-500" /> New Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">From Date</label>
                <input type="date" required value={formData.from_date} onChange={(e) => setFormData({...formData, from_date: e.target.value})} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 [color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">To Date</label>
                <input type="date" required value={formData.to_date} onChange={(e) => setFormData({...formData, to_date: e.target.value})} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 [color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Reason</label>
                <textarea required rows="4" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 resize-none placeholder-slate-600" placeholder="Please specify the reason for your leave..."></textarea>
              </div>
              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-amber-500/20 transform transition hover:-translate-y-0.5 mt-2">
                Submit Application
              </button>
            </form>
          </div>

          {/* Past Leaves */}
          <div className="glass rounded-2xl bg-slate-800/50 border border-slate-700/50 shadow-2xl p-6">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ClipboardList size={20} className="text-blue-400" /> Past Applications</h2>
             {loading ? (
                <div className="animate-pulse flex space-x-4"><div className="h-20 w-full bg-slate-700 rounded"></div></div>
             ) : leaves.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">No leave applications found.</div>
             ) : (
                <div className="space-y-4">
                  {leaves.map((l) => (
                    <div key={l.id} className="p-5 bg-slate-900/50 rounded-xl border border-slate-700/50 flex justify-between items-start hover:border-slate-600 transition">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white font-semibold">
                            {new Date(l.from_date).toLocaleDateString()}
                          </span>
                          <span className="text-slate-500 text-sm">to</span>
                          <span className="text-white font-semibold">
                            {new Date(l.to_date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mt-2">{l.reason}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                          ${l.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' 
                          : l.status === 'rejected' ? 'bg-red-500/20 text-red-500' 
                          : 'bg-amber-500/20 text-amber-500'}`}
                      >
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Leave;
