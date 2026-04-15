import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Home, Users, CheckCircle, ArrowLeft } from 'lucide-react';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getStatusColor = (occupied, capacity) => {
    if (occupied === 0) return 'bg-emerald-500 shadow-emerald-500/20'; // Green: Available
    if (occupied >= capacity) return 'bg-red-500 shadow-red-500/20';    // Red: Occupied
    return 'bg-slate-500 shadow-slate-500/20';                         // Grey: Partial
  };

  const getStatusText = (occupied, capacity) => {
    if (occupied === 0) return 'Available';
    if (occupied >= capacity) return 'Occupied';
    return 'Partially Filled';
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/rooms');
        setRooms(res.data);
      } catch (err) {
        setError('Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleChooseRoom = async (roomId) => {
    try {
      await axios.post('http://localhost:5000/api/rooms/choose', { roomId });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to select room');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-400 hover:text-white transition mb-4">
              <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Room Selection</h1>
            <p className="text-slate-400 mt-1">Choose your accommodation for the semester.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room) => {
            const isFull = room.occupied >= room.capacity;
            return (
              <div key={room.id} className="glass rounded-2xl overflow-hidden bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 hover:-translate-y-1 transform transition duration-300">
                <div className={`h-2 w-full ${isFull ? 'bg-red-500' : room.occupied > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Home size={20} className={isFull ? 'text-red-400' : room.occupied > 0 ? 'text-amber-400' : 'text-emerald-400'} />
                      <h3 className="text-xl font-bold">Room {room.room_no}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${isFull ? 'bg-red-500/20 text-red-400' : room.occupied > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {room.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1.5"><Users size={16} /> Capacity</span>
                      <span className="font-medium text-white">{room.capacity} Persons</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1.5"><CheckCircle size={16} /> Occupied</span>
                      <span className="font-medium text-white">{room.occupied} / {room.capacity}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleChooseRoom(room.id)}
                    disabled={isFull}
                    className={`w-full py-2.5 rounded-xl font-medium transition duration-200 shadow-lg ${
                      isFull 
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed shadow-none' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/20 hover:shadow-blue-500/40'
                    }`}
                  >
                    {isFull ? 'Fully Occupied' : 'Select Room'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
};

export default Rooms;
